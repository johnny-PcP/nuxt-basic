import { z } from 'zod'

/**
 * 專案配置 Schema 定義
 *
 * 定義專案運行時所需的所有配置項目和驗證規則
 * 確保配置的類型安全性和完整性
 */
export const ProjectConfigSchema = z.object({
  // API 服務配置
  environment: z.enum(['development', 'docker', 'production']),
  baseURL: z.string().min(1, 'API 基礎 URL 不能為空'),
  timeout: z.number().positive('API 超時時間必須大於 0'),

  // 應用程式狀態配置
  appDebug: z.boolean(),
})

/**
 * 專案配置型別
 *
 * 從 ProjectConfigSchema 推導出的 TypeScript 型別
 * 確保編譯時和運行時的型別一致性
 */
export type ProjectConfigType = z.infer<typeof ProjectConfigSchema>
