import prisma from '../utils/prisma';
import { Role } from '@prisma/client';
import { RegisterDto, UpdateUserDto } from '../types/common.types';

export const findUserById = (id: string) =>
  prisma.user.findFirst({ where: { id, is_deleted: false } });

export const findUserByPhone = (phone: string) =>
  prisma.user.findFirst({ where: { phone, is_deleted: false } });

export const findUserByEmail = (email: string) =>
  prisma.user.findFirst({ where: { email, is_deleted: false } });

export const createUser = (data: RegisterDto & { password?: string }) =>
  prisma.user.create({
    data: {
      user_name: data.user_name,
      phone: data.phone,
      email: data.email,
      password: data.password,
      role: (data.role as Role) ?? 'CUSTOMER',
    },
  });

export const updateUser = (id: string, data: UpdateUserDto) =>
  prisma.user.update({ where: { id }, data });

export const softDeleteUser = (id: string) =>
  prisma.user.update({ where: { id }, data: { is_deleted: true } });

export const findAllUsers = (filters: { role?: Role; page: number; limit: number }) => {
  const where = {
    is_deleted: false,
    ...(filters.role && { role: filters.role }),
  };
  return Promise.all([
    prisma.user.findMany({
      where,
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      select: { id: true, user_name: true, phone: true, email: true, role: true, created_at: true },
    }),
    prisma.user.count({ where }),
  ]);
};
