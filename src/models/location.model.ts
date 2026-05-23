import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';
import { CreateLocationDto, LocationFilters } from '../types/common.types';

export const findLocationById = (id: string) =>
  prisma.location.findFirst({ where: { id, is_deleted: false } });

export const findAllLocations = (filters: LocationFilters) => {
  const where: Prisma.LocationWhereInput = {
    is_deleted: false,
    ...(filters.province && { province: filters.province }),
    ...(filters.district && { district: filters.district }),
    ...(filters.town && { town: filters.town }),
    ...(filters.search && {
      OR: [
        { place_name: { contains: filters.search, mode: 'insensitive' } },
        { special_name: { contains: filters.search, mode: 'insensitive' } },
        { town: { contains: filters.search, mode: 'insensitive' } },
        { district: { contains: filters.search, mode: 'insensitive' } },
      ],
    }),
  };
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  return Promise.all([
    prisma.location.findMany({ where, skip: (page - 1) * limit, take: limit }),
    prisma.location.count({ where }),
  ]);
};

export const findDistinctProvinces = () =>
  prisma.location.findMany({
    where: { is_deleted: false, province: { not: null } },
    select: { province: true },
    distinct: ['province'],
  });

export const findDistinctDistricts = (province?: string) =>
  prisma.location.findMany({
    where: { is_deleted: false, district: { not: null }, ...(province && { province }) },
    select: { district: true },
    distinct: ['district'],
  });

export const findDistinctTowns = (district?: string) =>
  prisma.location.findMany({
    where: { is_deleted: false, town: { not: null }, ...(district && { district }) },
    select: { town: true },
    distinct: ['town'],
  });

export const createLocation = (data: CreateLocationDto) =>
  prisma.location.create({ data });

export const updateLocation = (id: string, data: Partial<CreateLocationDto>) =>
  prisma.location.update({ where: { id }, data });

export const softDeleteLocation = (id: string) =>
  prisma.location.update({ where: { id }, data: { is_deleted: true } });
