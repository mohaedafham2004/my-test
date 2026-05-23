import { Request, Response, NextFunction } from 'express';
import * as locationService from '../services/location.service';
import { sendSuccess } from '../utils/response';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { province, district, town, search, page, limit } = req.query;
    const result = await locationService.getAll({
      province: province as string,
      district: district as string,
      town: town as string,
      search: search as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return sendSuccess(res, result, 'Locations fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const location = await locationService.getById(req.params.id);
    return sendSuccess(res, location, 'Location fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function getProvinces(_req: Request, res: Response, next: NextFunction) {
  try {
    const provinces = await locationService.getProvinces();
    return sendSuccess(res, provinces, 'Provinces fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function getDistricts(req: Request, res: Response, next: NextFunction) {
  try {
    const districts = await locationService.getDistricts(req.query.province as string);
    return sendSuccess(res, districts, 'Districts fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function getTowns(req: Request, res: Response, next: NextFunction) {
  try {
    const towns = await locationService.getTowns(req.query.district as string);
    return sendSuccess(res, towns, 'Towns fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const location = await locationService.create(req.body);
    return sendSuccess(res, location, 'Location created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const location = await locationService.update(req.params.id, req.body);
    return sendSuccess(res, location, 'Location updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function softDelete(req: Request, res: Response, next: NextFunction) {
  try {
    await locationService.softDelete(req.params.id);
    return sendSuccess(res, null, 'Location deleted successfully');
  } catch (err) {
    next(err);
  }
}
