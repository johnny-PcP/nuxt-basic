import type { ProjectConfigType } from '~/service/schema/config'
import { useRuntimeConfig } from '#app'
import { validateSchema } from '~/service/schema/common'
import { ProjectConfigSchema } from '~/service/schema/config'

// 專案配置管理函數 - 根據環境提供統一的配置接口
export function useProjectConfig(): ProjectConfigType {
  const config = useRuntimeConfig()

  // 配置物件組裝 - 完全遵循 .env 文件設定
  const rawConfig = {
    // API 服務配置
    environment: String(config.public.apiEnv || 'development'),
    baseURL: String(config.public.apiBaseUrl || '/mock'),
    timeout: Number(config.public.apiTimeout || 5000),

    // 應用程式狀態配置
    appDebug: Boolean(config.public.appDebug),
  }

  // 配置驗證與回傳
  const result = validateSchema(ProjectConfigSchema, rawConfig, {
    errorMessage: 'Config配置驗證失敗',
    throwOnError: true,
  })

  return result.data!
}
