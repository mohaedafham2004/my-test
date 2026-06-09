import { Request, Response, NextFunction } from 'express';
import * as weatherService from '../services/weather.service';
import { sendSuccess } from '../utils/response';

export async function getWeatherForLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await weatherService.getWeatherByLocationId(
      req.params.locationId,
      req.user!.id
    );
    return sendSuccess(res, result, 'Weather fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function searchWeather(req: Request, res: Response, next: NextFunction) {
  try {
    const { province, district, town } = req.query;
    const results = await weatherService.searchWeather(
      {
        province: province as string,
        district: district as string,
        town: town as string,
      },
      req.user!.id
    );
    return sendSuccess(res, results, 'Weather search completed');
  } catch (err) {
    next(err);
  }
}

export async function getBestWeather(req: Request, res: Response, next: NextFunction) {
  try {
    const province = req.query.province as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const results = await weatherService.getBestWeather(province, limit);
    return sendSuccess(res, results, 'Best weather locations fetched');
  } catch (err) {
    next(err);
  }
}
