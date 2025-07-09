import { z } from 'zod';
import { createApiResponseSchema } from './common';

// 定義 User Schema
export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, '姓名不能為空'),
  email: z.string().email('電子郵件格式錯誤'),
  age: z.number().min(1, '年齡應大於1').optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
});

// 建立 User List Schema
export const UserListSchema = z.array(UserSchema);

// 建立 API Response Schema
export const UserResponseSchema = createApiResponseSchema(UserSchema);
export const UserListResponseSchema = createApiResponseSchema(UserListSchema);

// TypeScript推導型別
export type User = z.infer<typeof UserSchema>;
export type UserList = z.infer<typeof UserListSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserListResponse = z.infer<typeof UserListResponseSchema>;

// 表單Schema
export const CreateUserSchema = UserSchema.omit({ id: true, createdAt: true });
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
