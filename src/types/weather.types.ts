export interface OWMCurrentWeatherResponse {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  sys: { sunrise: number; sunset: number };
  name: string;
  cod: number;
}

export interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  visibility: number;
  uv_index: null;
  sunrise: string;
  sunset: string;
}

export interface WeatherVerdict {
  score: number;
  rating: 'GOOD' | 'MODERATE' | 'BAD';
  condition_tag: string;
  travel_advice: string;
  suitable_for: string[];
  not_suitable_for: string[];
}

export interface WeatherResult {
  location: {
    id: string;
    place_name: string | null;
    town: string | null;
    district: string | null;
    province: string | null;
  };
  weather: WeatherData;
  verdict: WeatherVerdict;
  fetched_at: string;
}
