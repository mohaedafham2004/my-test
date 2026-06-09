import * as opinionModel from '../models/opinion.model';
import * as locationModel from '../models/location.model';
import { AppError } from '../utils/AppError';
import { UpsertOpinionDto } from '../types/common.types';

export async function getAll(userId: string, filters: { favourite?: boolean; saved?: boolean }) {
  return opinionModel.findAllOpinions(userId, filters);
}

export async function getByLocation(userId: string, locationId: string) {
  return opinionModel.findOpinionByLocation(userId, locationId);
}

export async function upsert(userId: string, data: UpsertOpinionDto) {
  const location = await locationModel.findLocationById(data.location_id);
  if (!location) throw new AppError('Location not found', 404, 'LOCATION_NOT_FOUND');
  return opinionModel.upsertOpinion(userId, data);
}

export async function remove(userId: string, locationId: string) {
  const opinion = await opinionModel.findOpinionByLocation(userId, locationId);
  if (!opinion) throw new AppError('Opinion not found', 404, 'OPINION_NOT_FOUND');
  await opinionModel.deleteOpinion(userId, locationId);
}
