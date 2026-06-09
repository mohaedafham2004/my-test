import prisma from '../utils/prisma';
import { SearchHistoryPayload } from '../types/common.types';

export const createActivity = (userId: string, searchHistory: SearchHistoryPayload) =>
  prisma.activity.create({
    data: { user_id: userId, search_history: searchHistory as object },
  });

export const findUserActivities = (userId: string, page: number, limit: number) =>
  Promise.all([
    prisma.activity.findMany({
      where: { user_id: userId, is_deleted: false },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.activity.count({ where: { user_id: userId, is_deleted: false } }),
  ]);

export const softDeleteAllActivities = (userId: string) =>
  prisma.activity.updateMany({ where: { user_id: userId }, data: { is_deleted: true } });
