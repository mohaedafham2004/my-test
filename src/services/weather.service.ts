import axios from 'axios';
import { config } from '../config/env';
import * as locationModel from '../models/location.model';
import { scoreWeather } from './weatherScoring.service';
import * as activityService from './activity.service';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { OWMCurrentWeatherResponse, WeatherResult } from '../types/weather.types';
import { Location } from '@prisma/client';

const owmClient = axios.create({
  baseURL: config.owmBaseUrl,
  params: { appid: config.owmApiKey, units: 'metric' },
  timeout: 8000,
});

async function fetchCurrentWeather(
  query: string | { lat: number; lon: number }
): Promise<OWMCurrentWeatherResponse> {
  try {
    const params = typeof query === 'string' ? { q: query } : { lat: query.lat, lon: query.lon };
    const response = await owmClient.get<OWMCurrentWeatherResponse>('/weather', { params });
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404)
        throw new AppError('Location not found in weather service', 404, 'WEATHER_LOCATION_NOT_FOUND');
      if (err.response?.status === 401)
        throw new AppError('Weather API key invalid', 500, 'WEATHER_API_KEY_ERROR');
      if (err.response?.status === 429)
        throw new AppError('Weather API rate limit reached', 503, 'WEATHER_RATE_LIMIT');
    }
    throw new AppError('Failed to fetch weather data', 502, 'WEATHER_FETCH_ERROR');
  }
}

function buildQuery(location: Location): string | { lat: number; lon: number } {
  if (location.latitude && location.longitude) {
    return { lat: location.latitude, lon: location.longitude };
  }
  if (location.town) return location.town;
  if (location.district) return location.district;
  if (location.province) return location.province;
  throw new AppError('Location has no searchable data', 400, 'LOCATION_NO_DATA');
}

function transformOWMData(owm: OWMCurrentWeatherResponse) {
  return {
    temperature: owm.main.temp,
    feels_like: owm.main.feels_like,
    humidity: owm.main.humidity,
    wind_speed: owm.wind.speed,
    description: owm.weather[0].description,
    icon: owm.weather[0].icon,
    visibility: owm.visibility,
    uv_index: null as null,
    sunrise: new Date(owm.sys.sunrise * 1000).toISOString(),
    sunset: new Date(owm.sys.sunset * 1000).toISOString(),
  };
}

function buildResult(location: Location, owm: OWMCurrentWeatherResponse): WeatherResult {
  return {
    location: {
      id: location.id,
      place_name: location.place_name,
      town: location.town,
      district: location.district,
      province: location.province,
    },
    weather: transformOWMData(owm),
    verdict: scoreWeather(owm),
    fetched_at: new Date().toISOString(),
  };
}

export async function getWeatherByLocationId(
  locationId: string,
  userId: string
): Promise<WeatherResult> {
  const location = await locationModel.findLocationById(locationId);
  if (!location) throw new AppError('Location not found', 404, 'LOCATION_NOT_FOUND');

  const query = buildQuery(location);
  const owm = await fetchCurrentWeather(query);
  const result = buildResult(location, owm);

  try {
    await activityService.logSearch(userId, {
      query: location.town ?? location.district ?? location.province ?? locationId,
      type: location.town ? 'town' : location.district ? 'district' : 'province',
      locationId: location.id,
      weatherFetched: true,
      verdict: result.verdict.rating,
      timestamp: new Date().toISOString(),
    });
  } catch (logErr) {
    logger.warn('Activity logging failed (non-critical):', logErr);
  }

  return result;
}

export async function searchWeather(
  filters: { province?: string; district?: string; town?: string },
  userId: string
): Promise<WeatherResult[]> {
  const [locations] = await locationModel.findAllLocations({ ...filters, page: 1, limit: 50 });
  if (!locations.length) {
    throw new AppError('No locations found for the given filters', 404, 'NO_LOCATIONS_FOUND');
  }

  const results = await Promise.allSettled(
    locations.map((loc) =>
      fetchCurrentWeather(buildQuery(loc)).then((owm) => buildResult(loc, owm))
    )
  );

  const successful = results
    .filter((r): r is PromiseFulfilledResult<WeatherResult> => r.status === 'fulfilled')
    .map((r) => r.value)
    .sort((a, b) => b.verdict.score - a.verdict.score);

  try {
    const query = filters.town ?? filters.district ?? filters.province ?? 'search';
    await activityService.logSearch(userId, {
      query,
      type: filters.town ? 'town' : filters.district ? 'district' : 'province',
      locationId: locations[0].id,
      weatherFetched: true,
      timestamp: new Date().toISOString(),
    });
  } catch (logErr) {
    logger.warn('Activity logging failed (non-critical):', logErr);
  }

  return successful;
}

export async function getBestWeather(
  province?: string,
  limit = 5
): Promise<WeatherResult[]> {
  const [locations] = await locationModel.findAllLocations({ province, page: 1, limit: 100 });
  if (!locations.length) throw new AppError('No locations found', 404, 'NO_LOCATIONS_FOUND');

  const results = await Promise.allSettled(
    locations.map((loc) =>
      fetchCurrentWeather(buildQuery(loc)).then((owm) => buildResult(loc, owm))
    )
  );

  return results
    .filter((r): r is PromiseFulfilledResult<WeatherResult> => r.status === 'fulfilled')
    .map((r) => r.value)
    .sort((a, b) => b.verdict.score - a.verdict.score)
    .slice(0, limit);
}
