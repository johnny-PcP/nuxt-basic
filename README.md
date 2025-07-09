# Nuxt 3 + Zod + Service 架構示範

> 一個展示如何在 Nuxt 3 中建立完整、類型安全 Service 層架構的示範專案，整合 Zod 進行資料驗證。

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 啟動開發環境

```bash
# 開發環境 (使用 Mock 資料)
npm run dev

# Docker 環境 (連接本地 API)
npm run dev:docker

# 生產環境 (連接遠端 API)
npm run dev:production
```

### 訪問測試頁面

開啟瀏覽器訪問：`http://localhost:3000/myTest`

## 📁 專案結構

```
├── .env                        # 預設環境配置
├── .env.development           # 開發環境配置
├── .env.docker               # Docker 環境配置
├── .env.production           # 生產環境配置
├── composables/
│   ├── useAppConfig.ts       # 應用配置管理 (新)
│   └── useConfigValidation.ts # 配置驗證工具 (新)
├── service/
│   ├── api/
│   │   └── user.ts           # User API 服務類別
│   ├── schema/
│   │   └── user.ts           # User Zod Schema 定義
│   └── mock/
│       └── user.json         # Mock 資料
├── pages/
│   └── myTest.vue            # 測試示範頁面
├── public/
│   └── mock/
│       └── users.json        # 公開 Mock 資料
└── docs/
    └── service-architecture-guide.md # 詳細使用指南
```

## 🔧 配置管理

### 環境變數說明

#### API 相關配置

- `API_ENV`: 環境名稱 (`development`/`docker`/`production`)
- `API_BASE_URL`: API 基礎 URL
- `API_USE_MOCK`: 是否使用 Mock 資料 (`true`/`false`)
- `API_TIMEOUT`: API 超時時間 (毫秒)

#### 應用程式配置

- `APP_NAME`: 應用程式名稱
- `APP_VERSION`: 應用程式版本

### 環境配置範例

#### `.env.development`

```bash
API_ENV=development
API_BASE_URL=/mock
API_USE_MOCK=true
API_TIMEOUT=5000
APP_NAME=Nuxt Service Demo
APP_VERSION=1.0.0
```

#### `.env.docker`

```bash
API_ENV=docker
API_BASE_URL=http://localhost:3001/api
API_USE_MOCK=false
API_TIMEOUT=10000
```

## ✨ 主要特色

### 🔒 完整的類型安全

- 使用 TypeScript + Zod 確保編譯時和運行時的類型安全
- 所有 API 資料都經過 Zod Schema 驗證
- 自動型別推導，減少手動型別定義

### 🏗️ 清晰的分層架構

- **Schema 層**: 定義資料結構和驗證規則
- **API 層**: 封裝 API 呼叫邏輯
- **配置層**: 管理不同環境的配置
- **元件層**: 業務邏輯與 UI 展示

### 🔧 靈活的環境管理

- 支援開發、Docker、生產環境自動切換
- 使用 `.env` 文件管理配置，避免硬編碼
- 配置驗證確保設定正確性

### ✅ 強大的資料驗證

- 使用 Zod 進行運行時資料驗證
- 提供有意義的中文錯誤訊息
- 支援複雜的驗證規則和資料轉換

## 🧪 測試功能

### 1. 配置檢視

- 顯示目前的環境配置資訊
- 即時反映配置變更

### 2. 用戶管理

- 載入用戶列表
- 創建新用戶
- 單一用戶查詢

### 3. Zod 驗證測試

- 提供多種測試範例
- 即時驗證結果顯示
- 詳細錯誤訊息

## 📖 詳細文件

請參閱 [`docs/service-architecture-guide.md`](./docs/service-architecture-guide.md) 了解：

- 完整的架構說明
- Service 層設計原則
- Zod Schema 最佳實踐
- 擴展指南

## 🛠️ 開發指南

### 新增 API 服務

1. **定義 Schema**

```typescript
// service/schema/product.ts
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  price: z.number().positive(),
});
```

2. **建立 API 服務**

```typescript
// service/api/product.ts
export class ProductApi {
  async getProducts(): Promise<Product[]> {
    // 實作邏輯...
  }
}
```

3. **建立 Mock 資料**

```json
// public/mock/products.json
[{ "id": 1, "name": "產品", "price": 100 }]
```

### 環境切換

```bash
# 方法 1: 使用預定義腳本
npm run dev:docker

# 方法 2: 直接設定環境變數
API_ENV=docker npm run dev

# 方法 3: 使用不同的 .env 文件
npm run dev --dotenv .env.docker
```

## 🔍 除錯

### 查看配置

在瀏覽器開發者工具中檢查：

```javascript
// 查看目前配置
console.log(useAppConfig());
```

### 常見問題

1. **useRuntimeConfig is not defined**: 確認已正確導入
2. **配置未生效**: 檢查 `.env` 文件路徑和格式
3. **API 呼叫失敗**: 確認 `API_BASE_URL` 設定

## 📚 相關技術

- [Nuxt 3](https://nuxt.com/) - Vue.js 全端框架
- [Zod](https://zod.dev/) - TypeScript 資料驗證庫
- [TypeScript](https://www.typescriptlang.org/) - 類型安全的 JavaScript
- [Vue 3](https://vuejs.org/) - 漸進式 JavaScript 框架

## 📄 授權

MIT License
