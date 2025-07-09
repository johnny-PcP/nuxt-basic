import { z } from 'zod';
import type { ZodSchema } from 'zod';

// 基礎 API Response Schema
export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

// 泛型 API Response Schema 函數
export function createApiResponseSchema<T extends ZodSchema>(dataSchema: T) {
  return BaseResponseSchema.extend({
    data: dataSchema,
  });
}

// 通用 Schema 驗證函數
export function validateSchema<T>(
  schema: ZodSchema<T>,
  data: unknown,
  context = '資料',
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error(`${context}驗證失敗:`, error);
    throw new Error(
      `${context}格式錯誤: ${
        error instanceof Error ? error.message : '未知錯誤'
      }`,
    );
  }
}
