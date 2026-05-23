import * as userModel from '../models/user.model';
import { AppError } from '../utils/AppError';
import { UpdateUserDto } from '../types/common.types';
import { Role } from '@prisma/client';

export async function getMe(userId: string) {
  const user = await userModel.findUserById(userId);
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  const { password: _pw, ...rest } = user;
  return rest;
}

export async function updateMe(userId: string, data: UpdateUserDto) {
  if (data.phone) {
    const existing = await userModel.findUserByPhone(data.phone);
    if (existing && existing.id !== userId) {
      throw new AppError('Phone already in use', 409, 'PHONE_EXISTS');
    }
  }
  const updated = await userModel.updateUser(userId, data);
  const { password: _pw, ...rest } = updated;
  return rest;
}

export async function deleteMe(userId: string) {
  await userModel.softDeleteUser(userId);
}

export async function getAllUsers(filters: { role?: string; page: number; limit: number }) {
  const [users, total] = await userModel.findAllUsers({
    role: filters.role as Role | undefined,
    page: filters.page,
    limit: filters.limit,
  });
  return { users, total, page: filters.page, limit: filters.limit };
}
