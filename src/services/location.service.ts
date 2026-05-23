import * as locationModel from '../models/location.model';
import { AppError } from '../utils/AppError';
import { CreateLocationDto, LocationFilters, UpdateLocationDto } from '../types/common.types';

export async function getAll(filters: LocationFilters) {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const [locations, total] = await locationModel.findAllLocations({ ...filters, page, limit });
  return { locations, total, page, limit };
}

export async function getById(id: string) {
  const location = await locationModel.findLocationById(id);
  if (!location) throw new AppError('Location not found', 404, 'LOCATION_NOT_FOUND');
  return location;
}

export async function getProvinces() {
  const rows = await locationModel.findDistinctProvinces();
  return rows.map((r) => r.province).filter(Boolean) as string[];
}

export async function getDistricts(province?: string) {
  const rows = await locationModel.findDistinctDistricts(province);
  return rows.map((r) => r.district).filter(Boolean) as string[];
}

export async function getTowns(district?: string) {
  const rows = await locationModel.findDistinctTowns(district);
  return rows.map((r) => r.town).filter(Boolean) as string[];
}

export async function create(data: CreateLocationDto) {
  return locationModel.createLocation(data);
}

export async function update(id: string, data: UpdateLocationDto) {
  await getById(id);
  return locationModel.updateLocation(id, data);
}

export async function softDelete(id: string) {
  await getById(id);
  await locationModel.softDeleteLocation(id);
}
