import type { CreateUserInput, User, UserList } from '../schema/user'
// 手動導入所有依賴 (關閉自動導入)
import { $fetch } from 'ofetch' // Nuxt 內建 fetch 函式
import { useProjectConfig } from '~/composables/useProjectConfig'
import { validateMultiple, validateSchema } from '~/service/schema/common'
import {
  CreateUserSchema,
  UserListResponseSchema,
  UserResponseSchema,
  UserSchema,
} from '../schema/user'

// 用戶 API 服務類別
export class UserApi {
  private getProjectConfig() {
    return useProjectConfig()
  }

  // 獲取所有用戶
  async getUsers(): Promise<UserList> {
    try {
      const projectConfig = this.getProjectConfig()

      // 根據環境決定 API 路徑
      const apiPath = projectConfig.environment === 'development'
        ? '/mock/users-api.json'
        : '/users'

      const response = await $fetch(apiPath, {
        baseURL: projectConfig.baseURL,
      })

      // 統一的 API Response 格式驗證
      const validationResult = validateSchema(
        UserListResponseSchema,
        response,
        {
          errorMessage: 'API 回應格式驗證失敗',
          throwOnError: true,
        },
      )
      return validationResult.data!.data
    }
    catch {
      throw new Error('獲取用戶列表失敗')
    }
  }

  // 根據 ID 獲取單一用戶
  async getUserById(id: number): Promise<User | null> {
    try {
      const projectConfig = this.getProjectConfig()

      // 根據環境決定 API 路徑
      const apiPath = projectConfig.environment === 'development'
        ? `/mock/user-${id}.json`
        : `/users/${id}`

      const response = await $fetch(apiPath, {
        baseURL: projectConfig.baseURL,
      })

      // 統一的 API Response 格式驗證
      const validationResult = validateSchema(UserResponseSchema, response, {
        errorMessage: 'API 回應格式驗證失敗',
        throwOnError: true,
      })
      return validationResult.data!.data
    }
    catch {
      // 如果找不到用戶，返回 null
      return null
    }
  }

  // 創建新用戶
  async createUser(userData: CreateUserInput): Promise<User> {
    try {
      // 輸入資料驗證
      const inputValidation = validateSchema(CreateUserSchema, userData, {
        errorMessage: '創建用戶輸入資料驗證失敗',
        throwOnError: true,
      })
      const validatedInput = inputValidation.data!
      const projectConfig = this.getProjectConfig()

      if (projectConfig.environment === 'development') {
        // 開發環境：模擬創建用戶
        const newUser: User = {
          id: Date.now(), // 簡單 ID 生成
          ...validatedInput,
          isActive: validatedInput.isActive ?? true,
          createdAt: new Date().toISOString(),
        }

        // 回傳 API 格式
        return newUser
      }
      else {
        // 生產環境：統一的 API 呼叫
        const response = await $fetch('/users', {
          method: 'POST',
          baseURL: projectConfig.baseURL,
          body: validatedInput,
        })

        // 統一的 API Response 格式驗證
        const responseValidation = validateSchema(UserResponseSchema, response, {
          errorMessage: 'API 回應格式驗證失敗',
          throwOnError: true,
        })
        return responseValidation.data!.data
      }
    }
    catch {
      throw new Error('創建用戶失敗')
    }
  }

  // 驗證用戶資料 - 環境條件式錯誤記錄
  validateUser(userData: unknown) {
    return validateSchema(UserSchema, userData, {
      errorMessage: '用戶資料驗證失敗',
      successMessage: '用戶資料驗證成功',
    })
  }

  // 批量驗證用戶資料
  validateUsers(userDataArray: unknown[]) {
    return validateMultiple(UserSchema, userDataArray, {
      errorMessage: '用戶資料批量驗證失敗',
      successMessage: '用戶資料批量驗證成功',
    })
  }

  // 驗證創建用戶輸入資料
  validateCreateUserInput(inputData: unknown) {
    return validateSchema(CreateUserSchema, inputData, {
      errorMessage: '創建用戶輸入資料驗證失敗',
      successMessage: '創建用戶輸入資料驗證成功',
    })
  }
}

// 單例實例導出
export const userApi = new UserApi()
