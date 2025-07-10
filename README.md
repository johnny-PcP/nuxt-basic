# Nuxt 3 大型專案通用模板

> 適用於大型專案和多人協作的 Nuxt 3 架構模板，整合 TypeScript、Zod、ESLint，並採用 Service 層設計模式。

## ⚠️ 重要：已禁用自動導入

**此專案已關閉 Nuxt 的自動導入功能，所有 Vue、Nuxt 和第三方函數都必須手動導入。**

```typescript
import { useRuntimeConfig } from '#app'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

// ✅ 正確 - 必須手動導入
const config = useRuntimeConfig()
const route = useRoute()
const data = ref([])
```

## 🚀 快速開始

1. 使用一般環境時，API會指向server/api目錄下的API。
2. 使用其他環境時，會以.env檔案中的API_BASE_URL為主。

```bash
# 安裝依賴
npm install

# 啟動開發環境
npm run dev

# 環境切換
npm run dev:docker        # Docker 環境
npm run dev:production    # 生產環境
```

## 📁 專案結構

```
├── composables/           # 組合式函數
├── service/
│   ├── api/              # API 服務類別
│   └── schema/           # Zod Schema 定義
├── pages/                # 頁面
├── server/api/           # 伺服器端 API (開發環境使用)
└── public/               # 靜態資源
```

## 🔧 代碼風格

使用 ESLint 自動格式化，**建議關閉 VS Code 內建格式化**：

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

```bash
npm run lint      # 檢查代碼風格
npm run lint:fix  # 自動修復
```

## 🏗️ 架構要求

### 必須使用 Zod 驗證

```typescript
import type { UserList } from '~/service/schema/user'
import { $fetch } from 'ofetch'
import { UserListSchema } from '~/service/schema/user'

export class UserApi {
  async getUsers(): Promise<UserList> {
    const response = await $fetch('/users.json')
    return UserListSchema.parse(response)
  }
}

export const userApi = new UserApi()
```

### 必須手動導入

```typescript
// 專案模組
import type { User } from '~/service/schema/user'

// Nuxt 3
import { navigateTo, useRuntimeConfig } from '#app'
// Vue 3
import { computed, onMounted, reactive, ref, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { useProjectConfig } from '~/composables/useProjectConfig'
import { userApi } from '~/service/api/user'
```

### 配置管理

```typescript
// ✅ 正確 - 使用配置管理
const config = useProjectConfig()
const baseURL = config.baseURL

// ❌ 錯誤 - 硬編碼
const baseURL = '/api/users'
```

## 🔧 環境配置

| 變數名         | 說明         | 預設值                  |
| -------------- | ------------ | ----------------------- |
| `API_ENV`      | 環境名稱     | `development`           |
| `API_BASE_URL` | API 基礎 URL | `http://localhost:3000` |
| `API_TIMEOUT`  | 超時時間(ms) | `5000`                  |

## 🚨 常見問題

多半會是忘記自動導入，請務必記得手動導入。

**useRuntimeConfig is not defined**

```typescript
import { useRuntimeConfig } from '#app'
```

**ref/reactive is not defined**

```typescript
import { reactive, ref } from 'vue'
```

## 📚 相關技術

- [Nuxt 3](https://nuxt.com/) - Vue.js 全端框架
- [Zod](https://zod.dev/) - TypeScript 資料驗證
- [ESLint](https://eslint.org/) - 代碼檢查工具
