# Nuxt 3 大型專案通用模板

> 適用於大型專案和多人協作的 Nuxt 3 架構模板，整合 TypeScript、Zod、ESLint。

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

### 環境檔案設定

基礎設定在 `.env`，開發時會以 `.env.development` 覆蓋設定：

```bash
# 開發模式時讀取順序：.env → .env.development
npm run dev  # 使用 --dotenv .env.development
```

## 📁 專案架構

```
├── .env                    # 環境變數檔案（模板階段：Git 追蹤，正式開發：建議取消追蹤）
├── .env.example           # 範例檔案（Git 追蹤）
├── .env.development       # 開發環境設定（正式開發時建立，Git 不追蹤）
├── .env.production        # 生產環境設定（正式開發時建立，Git 不追蹤）
├── assets/css/            # 全域樣式
├── composables/           # 通用組合函數
├── pages/                 # 頁面路由
├── server/api/            # 伺服器端 API 路由
└── service/               # 服務層
    ├── api/               # API 服務
    └── schema/            # 資料驗證 Schema

```

## � 專案架構

```
├── .env                    # 基礎環境變數
├── .env.development       # 開發環境設定（建立後請加入 .gitignore）
├── .env.production        # 生產環境設定（建立後請加入 .gitignore）
├── assets/css/            # 全域樣式
├── composables/           # 通用組合函數
├── pages/                 # 頁面路由
├── server/api/            # 伺服器端 API 路由
└── service/               # 服務層
    ├── api/               # API 服務
    └── schema/            # 資料驗證 Schema
```

## 📋 開發規範

### 1. 手動導入

```typescript
// ❌ 錯誤 - 不會自動導入
// ✅ 正確 - 必須手動導入
import { ref } from 'vue'

const data = ref([])
const data = ref([])
```

### 2. 資料驗證

```typescript
// 使用 Zod Schema 驗證所有 API 資料
import { userApi } from '~/service/api/user'

const result = userApi.validateUser(userData)
if (result.success) {
  // 使用已驗證的資料
  console.log(result.data)
}
```

### 3. 錯誤處理

```typescript
// 使用統一的錯誤處理機制
try {
  const users = await userApi.getUsers()
}
catch (error) {
  // 錯誤由 service 層處理
  console.error('載入失敗:', error.message)
}
```

## 🔨 建置與部署

### 開發環境

```bash
npm run dev
```

### 生產環境

```bash
# 建置
npm run build

# 啟動
npm run start
```

## 🏗️ Service 層架構

### API 服務 (`service/api/`)

- 統一的 API 呼叫接口
- 自動錯誤處理
- 資料驗證整合

### Schema 驗證 (`service/schema/`)

- 使用 Zod 進行資料驗證
- 型別安全保證
- 詳細錯誤訊息

### 範例使用

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

## 📝 重要提醒

1. **模板階段**：可直接修改 `.env` 檔案進行開發測試
2. **正式開發**：建議建立 `.env.development` 和 `.env.production` 並設定 Git 忽略
3. **手動導入**：所有 Vue/Nuxt 函數都必須手動導入
4. **型別安全**：所有 API 資料都經過 Zod 驗證
5. **錯誤處理**：使用統一的錯誤處理機制

## 🚨 常見問題

### Q: 為什麼要禁用自動導入？

A: 為了提高大型專案的可維護性，讓依賴關係更明確。

### Q: 環境變數沒有生效怎麼辦？

A: 1. 檢查檔案名稱是否正確 2. 重新啟動開發伺服器 3. 確認變數名稱沒有拼寫錯誤

### Q: 什麼時候該取消 .env 檔案的 Git 追蹤？

A: 模板階段可保持追蹤便於快速開始；正式開發時建議建立 `.env.development` 等檔案並設定 Git 忽略。

### Q: API 切換不生效？

A: 確認 `NUXT_PUBLIC_IS_USE_LOCAL_API` 設定正確，並重新啟動伺服器。

---

🎯 **目標**：建立一個可擴展、可維護、型別安全的 Nuxt 3 大型專案架構模板。
