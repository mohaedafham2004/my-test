import prisma from '../utils/prisma';
import { UpsertOpinionDto } from '../types/common.types';

export const findAllOpinions = (userId: string, filters: { favourite?: boolean; saved?: boolean }) =>
  prisma.opinion.findMany({
    where: {
      user_id: userId,
      ...(filters.favourite !== undefined && { favourite: filters.favourite }),
      ...(filters.saved !== undefined && { saved: filters.saved }),
    },
    include: { location: true },
  });

export const findOpinionByLocation = (userId: string, locationId: string) =>
  prisma.opinion.findUnique({
    where: { user_id_location_id: { user_id: userId, location_id: locationId } },
  });

export const upsertOpinion = (userId: string, data: UpsertOpinionDto) =>
  prisma.opinion.upsert({
    where: { user_id_location_id: { user_id: userId, location_id: data.location_id } },
    update: {
      favourite: data.favourite,
      saved: data.saved,
      previous_visit: data.previous_visit ? new Date(data.previous_visit) : undefined,
      future_visit: data.future_visit ? new Date(data.future_visit) : undefined,
    },
    create: {
      user_id: userId,
      location_id: data.location_id,
      favourite: data.favourite ?? false,
      saved: data.saved ?? false,
      previous_visit: data.previous_visit ? new Date(data.previous_visit) : undefined,
      future_visit: data.future_visit ? new Date(data.future_visit) : undefined,
    },
  });

export const deleteOpinion = (userId: string, locationId: string) =>
  prisma.opinion.delete({
    where: { user_id_location_id: { user_id: userId, location_id: locationId } },
  });
