/**
 * 用戶資料流相關的 Composable
 *
 * 這個 composable 包含了用戶頁面的業務邏輯
 */

import type { CreateUserInput, User } from '~/service/schema/user'
import { useRuntimeConfig } from '#app'
import { computed, onMounted, ref } from 'vue'
import { useProjectConfig } from '~/composables/useProjectConfig'
import { userApi } from '~/service/api/user'

// 用戶狀態管理
interface UserState {
  users: User[]
  loading: boolean
  creating: boolean
  error: string
}

export function useUserDataFlow() {
  // 取得 Runtime Config（原始值）- 只取得客戶端可用的部分
  const runtimeConfig = computed(() => {
    const config = useRuntimeConfig()
    // 只返回客戶端可存取的屬性
    return {
      public: config.public,
      app: config.app,
    }
  })

  // 取得專案配置
  const projectConfig = computed(() => useProjectConfig())

  // 響應式資料
  const userState = ref<UserState>({
    users: [],
    loading: false,
    creating: false,
    error: '',
  })

  // 清空用戶列表
  function clearUsers() {
    userState.value.users = []
  }

  // 載入用戶列表
  async function loadUsers() {
    userState.value.loading = true
    userState.value.error = ''

    try {
      userState.value.users = await userApi.getUsers()

      // 只在 console 模式開啟時記錄詳細信息
      if (projectConfig.value.showConsole) {
        console.log('載入的用戶:', userState.value.users)
        console.log('使用配置:', projectConfig.value)
      }
    }
    catch (err) {
      userState.value.error = err instanceof Error ? err.message : '未知錯誤'

      // 只在 console 模式開啟時記錄錯誤詳情
      if (projectConfig.value.showConsole) {
        console.error('載入用戶失敗:', err)
      }
    }
    finally {
      userState.value.loading = false
    }
  }

  // 載入單一用戶
  async function loadSingleUser(id: number): Promise<void> {
    try {
      const user = await userApi.getUserById(id)
      if (user) {
        // 只在 console 模式開啟時記錄詳細信息
        if (projectConfig.value.showConsole) {
          console.log('載入的單一用戶:', user)
        }

        // 更新列表中的用戶
        const index = userState.value.users.findIndex(u => u.id === id)
        if (index !== -1) {
          userState.value.users[index] = user
        }
      }
    }
    catch (err) {
      userState.value.error = err instanceof Error ? err.message : '載入用戶失敗'
    }
  }

  // 創建新用戶
  async function createNewUser(userData: CreateUserInput) {
    userState.value.creating = true
    userState.value.error = ''

    try {
      const createdUser = await userApi.createUser(userData)

      // 只在 console 模式開啟時記錄詳細信息
      if (projectConfig.value.showConsole) {
        console.log('創建的用戶:', createdUser)
      }

      // 添加到列表
      userState.value.users.push(createdUser)
    }
    catch (err) {
      userState.value.error = err instanceof Error ? err.message : '創建用戶失敗'

      // 只在 console 模式開啟時記錄錯誤詳情
      if (projectConfig.value.showConsole) {
        console.error('創建用戶失敗:', err)
      }
    }
    finally {
      userState.value.creating = false
    }
  }

  // 組件載入時自動載入用戶
  onMounted(() => {
    loadUsers()
  })

  return {
    // 配置相關
    runtimeConfig,
    projectConfig,

    // 用戶狀態
    userState,

    // 用戶操作方法
    clearUsers,
    loadUsers,
    loadSingleUser,
    createNewUser,
  }
}
