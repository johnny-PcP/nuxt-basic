// 由於關閉了 auto import，需要手動 import 所有 Nuxt 功能
import { $fetch } from 'ofetch'; // Nuxt 內建的 fetch 函式
import { useProjectConfig } from '~/composables/useProjectConfig';
import type {
  User,
  UserList,
  CreateUserInput,
  UserResponse,
  UserListResponse,
} from '../schema/user';
import {
  UserSchema,
  UserListSchema,
  UserResponseSchema,
  UserListResponseSchema,
  CreateUserSchema,
} from '../schema/user';

// 封裝的 API 類別
export class UserApi {
  private getProjectConfig() {
    return useProjectConfig();
  }

  /**
   * 獲取所有用戶
   * 使用 Zod 驗證回傳的資料格式
   */
  async getUsers(): Promise<UserList> {
    try {
      const projectConfig = this.getProjectConfig();

      if (projectConfig.useMock) {
        // 使用 Mock 資料
        const response = await $fetch('/users.json', {
          baseURL: projectConfig.baseURL,
        });

        // 使用 Zod 驗證資料格式
        const validatedData = UserListSchema.parse(response);
        return validatedData;
      } else {
        // 真實 API 呼叫
        const response = await $fetch<UserListResponse>('/users', {
          baseURL: projectConfig.baseURL,
        });

        // 驗證 API Response 格式
        const validatedResponse = UserListResponseSchema.parse(response);
        return validatedResponse.data;
      }
    } catch (error) {
      console.error('獲取用戶列表失敗:', error);
      throw new Error('獲取用戶列表失敗');
    }
  }

  /**
   * 根據 ID 獲取單一用戶
   */
  async getUserById(id: number): Promise<User | null> {
    try {
      const projectConfig = this.getProjectConfig();

      if (projectConfig.useMock) {
        // Mock 模式：從列表中尋找
        const users = await this.getUsers();
        const user = users.find((u) => u.id === id);

        if (!user) {
          return null;
        }

        // 再次驗證單一用戶資料
        return UserSchema.parse(user);
      } else {
        // 真實 API 呼叫
        const response = await $fetch<UserResponse>(`/users/${id}`, {
          baseURL: projectConfig.baseURL,
        });

        // 驗證 API Response 格式
        const validatedResponse = UserResponseSchema.parse(response);
        return validatedResponse.data;
      }
    } catch (error) {
      console.error('獲取用戶失敗:', error);
      throw new Error('獲取用戶失敗');
    }
  }

  /**
   * 創建新用戶
   */
  async createUser(userData: CreateUserInput): Promise<User> {
    try {
      // 先驗證輸入資料
      const validatedInput = CreateUserSchema.parse(userData);
      const projectConfig = this.getProjectConfig();

      if (projectConfig.useMock) {
        // Mock 模式：模擬創建用戶
        const newUser: User = {
          id: Date.now(), // 簡單的 ID 生成
          ...validatedInput,
          createdAt: new Date().toISOString(),
        };

        // 驗證建立的用戶資料
        return UserSchema.parse(newUser);
      } else {
        // 真實 API 呼叫
        const response = await $fetch<UserResponse>('/users', {
          method: 'POST',
          baseURL: projectConfig.baseURL,
          body: validatedInput,
        });

        // 驗證 API Response 格式
        const validatedResponse = UserResponseSchema.parse(response);
        return validatedResponse.data;
      }
    } catch (error) {
      console.error('創建用戶失敗:', error);
      throw new Error('創建用戶失敗');
    }
  }

  /**
   * 驗證用戶資料
   */
  validateUser(userData: unknown): {
    success: boolean;
    data?: User;
    error?: string;
  } {
    try {
      const validatedUser = UserSchema.parse(userData);
      return { success: true, data: validatedUser };
    } catch (error) {
      console.error('用戶資料驗證失敗:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '驗證失敗',
      };
    }
  }
}

// 導出單例實例
export const userApi = new UserApi();
