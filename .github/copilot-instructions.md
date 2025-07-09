# Copilot 專案指引

## 專案概述

這是一個 Nuxt 3 專案，展示如何建立完整、類型安全的 Service 層架構，整合 Zod 進行資料驗證。

## 重要設定

### 🚫 禁用 Auto Import

**重要：此專案已關閉 Nuxt 的自動導入功能**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  components: false, // 禁用自動導入 components
  imports: {
    autoImport: false, // 禁用自動導入 composables 和 utils
  },
});
```

### ✅ 手動導入規則

所有 Vue、Nuxt 和第三方函數都必須手動導入：

```typescript
// ❌ 錯誤 - 不會自動導入
const config = useRuntimeConfig();
const route = useRoute();

// ✅ 正確 - 必須手動導入
import { useRuntimeConfig } from '#app';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
```

## 架構規範

### Service 層架構

```
service/
├── api/           # API 服務類別
│   └── user.ts    # 封裝 API 呼叫邏輯
├── schema/        # Zod Schema 定義
│   └── user.ts    # 資料結構和驗證規則
└── mock/          # Mock 資料
    └── user.json  # 測試資料
```

### 必須使用 Zod 驗證

所有 API 資料都必須經過 Zod Schema 驗證：

```typescript
// ✅ 正確的 API 服務寫法
async getUsers(): Promise<UserList> {
  const response = await $fetch('/users.json')
  return UserListSchema.parse(response) // 必須使用 Zod 驗證
}
```

### 配置管理

使用環境變數和 `.env` 文件管理配置，避免硬編碼：

```typescript
// ✅ 正確 - 使用配置管理
const projectConfig = useProjectConfig();
const baseURL = projectConfig.baseURL;

// ❌ 錯誤 - 不要硬編碼
const baseURL = '/api/users';
```

## 常用導入模式

### Vue 3 Composition API

```typescript
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
```

### Nuxt 3 功能

```typescript
import { useRuntimeConfig } from '#app';
import { $fetch } from 'ofetch';
import { navigateTo } from '#app';
```

### 專案內部模組

```typescript
import { userApi } from '~/service/api/user';
import type { User, CreateUserInput } from '~/service/schema/user';
import { useProjectConfig } from '~/composables/useProjectConfig';
```

## 開發指南

### 新增 API 服務步驟

1. 在 `service/schema/` 定義 Zod Schema
2. 在 `service/api/` 建立 API 服務類別
3. 在 `public/mock/` 建立 Mock 資料
4. 所有 API 回應都必須通過 Zod 驗證

### 元件開發規範

```vue
<script setup lang="ts">
// 手動導入所有需要的功能
import { ref, onMounted } from 'vue';
import { userApi } from '~/service/api/user';
import type { User } from '~/service/schema/user';

// 使用配置而非硬編碼
const projectConfig = useProjectConfig();
</script>
```

### 錯誤處理

```typescript
try {
  const data = await userApi.getUsers();
  // 資料已經通過 Zod 驗證，類型安全
} catch (error) {
  // 統一錯誤處理
  console.error('API 呼叫失敗:', error);
}
```

## 環境切換

```bash
npm run dev              # 開發環境 (Mock 資料)
npm run dev:docker       # Docker 環境 (本地 API)
npm run dev:production   # 生產環境 (遠端 API)
```

## 注意事項

- 📝 所有導入都必須手動完成
- 🔍 使用 Zod 進行資料驗證
- ⚙️ 使用配置管理而非硬編碼
- 🏗️ 遵循 Service 層架構
- 📱 保持類型安全
