import * as userModel from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { signToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { RegisterDto, LoginDto } from '../types/common.types';

export async function register(data: RegisterDto) {
  const existing = await userModel.findUserByPhone(data.phone);
  if (existing) throw new AppError('Phone number already registered', 409, 'PHONE_EXISTS');

  if (data.email) {
    const byEmail = await userModel.findUserByEmail(data.email);
    if (byEmail) throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  const hashedPassword = data.password ? await hashPassword(data.password) : undefined;
  const user = await userModel.createUser({ ...data, password: hashedPassword });
  const token = signToken({ id: user.id, role: user.role });

  const { password: _pw, ...userWithoutPassword } = user;
  return { ...userWithoutPassword, token };
}

export async function login(data: LoginDto) {
  if (!data.phone && !data.email) {
    throw new AppError('Phone or email required', 400, 'MISSING_CREDENTIALS');
  }

  const user = data.phone
    ? await userModel.findUserByPhone(data.phone)
    : await userModel.findUserByEmail(data.email!);

  if (!user) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  if (user.is_deleted) throw new AppError('Account deactivated', 403, 'ACCOUNT_DEACTIVATED');
  if (!user.password) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');

  const match = await comparePassword(data.password, user.password);
  if (!match) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');

  const token = signToken({ id: user.id, role: user.role });
  const { password: _pw, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
}
