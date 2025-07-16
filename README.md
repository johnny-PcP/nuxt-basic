# Nuxt 3 大型專案通用模板

> 適用於大型專案和多人協作的 Nuxt 3 架構模板，整合 TypeScript、Zod、ESLint，採用現代化組件設計。

## 🏗️ 專案架構設計理念

### 1. 主要資料結構層 (`service/schema`)

- 使用 Zod Schema 定義所有資料結構的驗證規則
- 透過 `z.infer<typeof Schema>` 自動推導出 TypeScript 型別
- 提供統一的資料驗證和型別定義來源

### 2. API 服務層 (`service/api`)

- 建立 API 服務類別，包含對應的 API 方法
- **輸入驗證**：API 方法的參數使用 Zod Schema 進行驗證
- **輸出驗證**：API 方法的回傳資料使用 Zod Schema 進行驗證
- 確保所有 API 方法返回的資料都是已驗證的型別安全資料

### 3. 業務邏輯層 (`composables`)

- 使用 `service/api` 的方法來處理資料獲取和業務邏輯
- 整合多個 API 服務，提供更高階的業務功能
- 返回 reactive 的資料狀態和操作方法
- 所有返回的資料都已通過 Schema 驗證，保證型別安全

### 4. 組件展示層 (`components`)

- **分組原則**：按照主要業務實體分組（如 `user/`、`product/`、`order/` 等）
- **型別定義**：組件的 Props 和 Emits 型別直接定義在 `.vue` 檔案中
- **混合功能組件**：根據主要服務對象分類
  - 例如：`UserProductList.vue`（顯示用戶的商品）放在 `components/user/` 下
  - 例如：`ProductOrderHistory.vue`（顯示商品的訂單歷史）放在 `components/product/` 下
- **通用組件**：不特定於任何業務實體的組件放在 `components/shared/` 下

### 5. 頁面組裝層 (`pages`)

- 組合多個 composables 和 components 來構建完整頁面
- 處理路由相關邏輯和頁面級別的狀態管理

### 資料流向

```
Schema (定義) → API Service (驗證) → Composable (業務邏輯) → Component (展示) → Page (組裝)
```

## ⚠️ 重要提醒

### 1. 已禁用自動導入

**所有 Vue、Nuxt 和第三方函數都必須手動導入**

```typescript
import { useRuntimeConfig } from '#app'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

// ✅ 正確 - 必須手動導入
const config = useRuntimeConfig()
const route = useRoute()
const data = ref([])
```

### 2. API 路徑設定

**`NUXT_PUBLIC_IS_USE_LOCAL_API` 決定 API 呼叫路徑：**

- ✅ `true`：使用本地 API (`/api/xxx`)
- ✅ `false`：使用遠端 API (`NUXT_PUBLIC_API_BASE_URL/xxx`)

## 🚀 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發環境
npm run dev
```

## 🔧 環境配置

### 必要環境變數

| 變數名稱                       | 說明                  | 範例值                       |
| ------------------------------ | --------------------- | ---------------------------- |
| `NUXT_API_ENV`                 | 環境識別              | `development` / `production` |
| `NUXT_PUBLIC_API_BASE_URL`     | 遠端 API 基礎地址     | `https://api.example.com`    |
| `NUXT_PUBLIC_IS_USE_LOCAL_API` | 是否使用本地 API      | `true` / `false`             |
| `NUXT_PUBLIC_IS_SHOW_CONSOLE`  | 是否顯示 console 除錯 | `true` / `false`             |
| `NUXT_PUBLIC_API_TIMEOUT`      | API 超時時間（毫秒）  | `5000`                       |

## 📁 專案結構

```
├── .env.example           # 範例檔案（Git 追蹤）
├── .env.development       # 開發環境設定（正式開發時建立，Git 不追蹤）
├── .env.production        # 生產環境設定（正式開發時建立，Git 不追蹤）
├── assets/css/            # 全域樣式
├── components/            # 組件
│   ├── shared/           # 通用組件
│   └── user/             # 用戶相關組件
├── composables/           # 組合函數
├── pages/                 # 頁面路由
├── server/api/            # 伺服器端 API 路由
├── service/               # 服務層
│   ├── api/              # API 服務
│   └── schema/           # 資料驗證 Schema
└── types/                # 型別定義
```

## 🌟 功能特色

### 1. 完整的資料流架構

- **Schema 驗證**：使用 Zod 確保資料型別安全
- **API 服務**：統一的 API 呼叫管理
- **組件化設計**：可重用的 Vue 組件
- **響應式狀態**：使用 Composables 管理狀態

### 2. 開發體驗優化

- **TypeScript**：完整的型別檢查
- **ESLint**：程式碼品質保證
- **手動導入**：明確的依賴管理
- **環境配置**：多環境支援

### 3. 示例頁面

- **首頁**：專案概覽和導航
- **資料流示例**：完整的 CRUD 操作展示

## 📋 開發規範

### 1. 組件設計原則

```typescript
// 組件型別定義在 .vue 檔案中
interface Props {
  data: DataType[]
  loading?: boolean
}

interface Emits {
  update: [data: DataType]
}
```

### 2. 資料驗證流程

```typescript
// 1. 定義 Schema
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
})

// 2. 在 API 服務中使用
export class UserApi {
  async getUsers(): Promise<User[]> {
    const response = await $fetch('/api/users')
    return UserSchema.array().parse(response)
  }
}
```

### 3. 組件分組策略

```
components/
├── shared/          # 通用組件
├── user/            # 用戶相關組件
├── product/         # 商品相關組件（示例）
└── order/           # 訂單相關組件（示例）
```

## 🔧 開發工具

### 環境變數管理

基礎設定在 `.env`，開發時會以 `.env.development` 覆蓋設定：

```bash
# 開發模式時讀取順序：.env → .env.development
npm run dev  # 使用 --dotenv .env.development
```

### 建置與部署

```bash
# 開發環境
npm run dev

# 生產環境
npm run build
npm run start
```

### Service 層使用

```typescript
// 載入 API 服務
import { userApi } from '~/service/api/user'

// 取得用戶列表（方法內部會驗證API回傳資料）
const users = await userApi.getUsers()

// 建立用戶（方法內部會驗證API回傳資料）
const newUser = await userApi.createUser({
  name: 'John',
  email: 'john@example.com'
})
```

## 🚨 常見問題

### Q: 為什麼要禁用自動導入？

A: 為了提高大型專案的可維護性，讓依賴關係更明確。

### Q: 環境變數沒有生效怎麼辦？

A: 1. 檢查檔案名稱是否正確 2. 重新啟動開發伺服器 3. 確認變數名稱沒有拼寫錯誤

### Q: API 切換不生效？

A: 確認 `NUXT_PUBLIC_IS_USE_LOCAL_API` 設定正確，並重新啟動伺服器。

---

🎯 **目標**：建立一個可擴展、可維護、型別安全的 Nuxt 3 大型專案架構模板。
