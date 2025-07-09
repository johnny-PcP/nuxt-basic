import { z } from 'zod';

// 定義專案配置 Schema
export const ProjectConfigSchema = z.object({
  // API 相關配置
  environment: z.enum(['development', 'docker', 'production']),
  baseURL: z.string().min(1), // 簡化 baseURL 驗證，只要求非空字串
  useMock: z.boolean(),
  timeout: z.number().positive(),

  // 應用程式相關配置
  appName: z.string().min(1),
  appVersion: z.string().min(1), // 簡化版本驗證
  appDebug: z.boolean(),
});

// 類型推導
export type ProjectConfigType = z.infer<typeof ProjectConfigSchema>;
