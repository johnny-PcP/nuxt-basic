import { z } from 'zod'

// 專案配置 Schema 定義
export const ProjectConfigSchema = z.object({
  // API 服務配置
  environment: z.enum(['development', 'docker', 'production']),
  baseURL: z.string().min(1),
  timeout: z.number().positive(),

  // 應用程式狀態配置
  appDebug: z.boolean(),
})

// 專案配置型別推導
export type ProjectConfigType = z.infer<typeof ProjectConfigSchema>
