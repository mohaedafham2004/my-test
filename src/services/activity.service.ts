import * as activityModel from '../models/activity.model';
import { logger } from '../utils/logger';
import { SearchHistoryPayload } from '../types/common.types';

export async function logSearch(userId: string, searchData: SearchHistoryPayload): Promise<void> {
  await activityModel.createActivity(userId, searchData);
}

export async function getUserHistory(userId: string, page: number, limit: number) {
  const [activities, total] = await activityModel.findUserActivities(userId, page, limit);
  return { activities, total, page, limit };
}

export async function clearHistory(userId: string): Promise<void> {
  await activityModel.softDeleteAllActivities(userId);
}
