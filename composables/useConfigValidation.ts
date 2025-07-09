import { z } from 'zod';

// 定義配置 Schema
export const ApiConfigSchema = z.object({
  environment: z.enum(['development', 'docker', 'production']),
  baseURL: z.string().min(1), // 簡化 baseURL 驗證，只要求非空字串
  useMock: z.boolean(),
  timeout: z.number().positive(),
});

export const AppConfigSchema = z.object({
  api: ApiConfigSchema,
  app: z.object({
    name: z.string().min(1),
    version: z.string().min(1), // 簡化版本驗證
    debug: z.boolean(),
  }),
});

// 類型推導
export type ApiConfigType = z.infer<typeof ApiConfigSchema>;
export type AppConfigType = z.infer<typeof AppConfigSchema>;

// 配置驗證函數
export function validateConfig<T>(schema: z.ZodSchema<T>, config: unknown): T {
  try {
    return schema.parse(config);
  } catch (error) {
    console.error('配置驗證失敗:', error);
    throw new Error(
      `配置格式錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`,
    );
  }
}
