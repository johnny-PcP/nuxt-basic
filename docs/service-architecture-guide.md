# Nuxt 3 + Zod + Service 架構使用指南

## 📋 目錄

- [專案概述](#專案概述)
- [架構說明](#架構說明)
- [使用測試頁面](#使用測試頁面)
- [Service 層架構規劃](#service-層架構規劃)
- [Zod Schema 設計](#zod-schema-設計)
- [API 配置管理](#api-配置管理)
- [最佳實踐](#最佳實踐)

## 🚀 專案概述

本專案展示了如何在 Nuxt 3 中建立一個完整的、類型安全的 Service 層架構，整合 Zod 進行資料驗證。

### 主要特色

- 🔒 **類型安全**: 使用 TypeScript + Zod 確保完整的類型安全
- 🏗️ **分層架構**: 清晰的 Service 層分離業務邏輯
- 🔧 **配置管理**: 靈活的環境配置，支持 Mock/Docker/Production
- ✅ **資料驗證**: 完整的 Zod Schema 驗證機制
- 📱 **實際示範**: 提供完整的 CRUD 操作範例

## 🏗️ 架構說明

### 目錄結構

```
├── composables/
│   └── useApiConfig.ts          # API 配置管理
├── service/
│   ├── api/
│   │   └── user.ts              # User API 服務類別
│   ├── schema/
│   │   └── user.ts              # User Zod Schema 定義
│   └── mock/
│       └── user.json            # Mock 資料
├── pages/
│   └── myTest.vue               # 測試示範頁面
└── public/
    └── mock/
        └── users.json           # 公開 Mock 資料
```

### 分層說明

#### 1. Schema 層 (`service/schema/`)

- 定義所有資料結構的 Zod Schema
- 提供 TypeScript 類型推導
- 包含驗證規則和錯誤訊息

#### 2. API 層 (`service/api/`)

- 封裝 API 呼叫邏輯
- 整合 Zod 驗證
- 處理不同環境的 API 呼叫

#### 3. 配置層 (`composables/`)

- 管理不同環境的配置
- 提供統一的配置介面

## 🧪 使用測試頁面

### 訪問測試頁面

開啟瀏覽器訪問：`http://localhost:3000/myTest`

### 測試功能

#### 1. API 配置檢視

頁面頂部會顯示目前的 API 配置：

- **環境**: development/docker/production
- **Base URL**: API 基礎路徑
- **使用 Mock**: 是否使用 Mock 資料

#### 2. 用戶列表管理

- **載入用戶**: 從 API 或 Mock 資料載入用戶列表
- **清空列表**: 清空前端顯示的用戶列表
- **重新載入單一用戶**: 重新載入特定用戶的資料

#### 3. 創建新用戶

表單包含完整的用戶資訊：

- **姓名**: 必填欄位，不能為空
- **Email**: 必填欄位，需符合 Email 格式
- **年齡**: 選填欄位，必須大於 1
- **活躍狀態**: 布林值，預設為 true

#### 4. Zod 驗證測試

提供三種測試範例：

- **有效資料**: 符合 Schema 的完整資料
- **無效資料**: 包含各種格式錯誤的資料
- **部分資料**: 只包含部分欄位的資料

### 環境切換測試

#### 切換到 Mock 模式 (預設)

```bash
# 不設定或設定為 development
npm run dev
```

#### 切換到 Docker 模式

```bash
API_ENV=docker npm run dev
```

#### 切換到 Production 模式

```bash
API_ENV=production npm run dev
```

## 🏗️ Service 層架構規劃

### 1. Schema 設計原則

#### 基本 Schema 結構

```typescript
// service/schema/user.ts
export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, '姓名不能為空'),
  email: z.string().email('電子郵件格式錯誤'),
  age: z.number().min(1, '年齡應大於1').optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
});
```

#### 衍生 Schema

```typescript
// 列表 Schema
export const UserListSchema = z.array(UserSchema);

// API Response Schema
export const UserResponseSchema = z.object({
  success: z.boolean(),
  data: UserSchema,
  message: z.string().optional(),
});

// 表單 Schema (排除自動生成欄位)
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
});
```

#### 類型推導

```typescript
export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

### 2. API 服務類別設計

#### 類別結構

```typescript
export class UserApi {
  // 取得配置
  private getApiConfig() {
    return useApiConfig();
  }

  // CRUD 方法
  async getUsers(): Promise<UserList>;
  async getUserById(id: number): Promise<User | null>;
  async createUser(userData: CreateUserInput): Promise<User>;

  // 驗證方法
  validateUser(userData: unknown): ValidationResult;
}
```

#### 環境適應性

```typescript
async getUsers(): Promise<UserList> {
  const apiConfig = this.getApiConfig();

  if (apiConfig.useMock) {
    // Mock 資料邏輯
    const response = await $fetch('/users.json', {
      baseURL: apiConfig.baseURL,
    });
    return UserListSchema.parse(response);
  } else {
    // 真實 API 邏輯
    const response = await $fetch<UserListResponse>('/users', {
      baseURL: apiConfig.baseURL,
    });
    return UserListResponseSchema.parse(response).data;
  }
}
```

### 3. 新增其他實體的步驟

#### 步驟 1: 建立 Schema

```typescript
// service/schema/product.ts
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  price: z.number().positive(),
  category: z.string(),
  inStock: z.boolean().default(true),
});

export const CreateProductSchema = ProductSchema.omit({ id: true });
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
```

#### 步驟 2: 建立 API 服務

```typescript
// service/api/product.ts
export class ProductApi {
  private getApiConfig() {
    return useApiConfig();
  }

  async getProducts(): Promise<Product[]> {
    // 實作邏輯...
  }
}

export const productApi = new ProductApi();
```

#### 步驟 3: 建立 Mock 資料

```json
// public/mock/products.json
[
  {
    "id": 1,
    "name": "範例產品",
    "price": 100,
    "category": "範例分類",
    "inStock": true
  }
]
```

## 🔍 Zod Schema 設計

### 基本驗證類型

#### 字串驗證

```typescript
z.string(); // 基本字串
z.string().min(1, '不能為空'); // 最小長度
z.string().max(100, '長度過長'); // 最大長度
z.string().email('格式錯誤'); // Email 格式
z.string().url('URL 格式錯誤'); // URL 格式
z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式錯誤'); // 正則表達式
```

#### 數字驗證

```typescript
z.number(); // 基本數字
z.number().int('必須是整數'); // 整數
z.number().positive('必須是正數'); // 正數
z.number().min(0, '不能小於0'); // 最小值
z.number().max(100, '不能大於100'); // 最大值
```

#### 其他類型

```typescript
z.boolean(); // 布林值
z.date(); // 日期
z.array(z.string()); // 字串陣列
z.enum(['A', 'B', 'C']); // 枚舉
z.union([z.string(), z.number()]); // 聯合類型
z.object({ key: z.string() }); // 物件
```

### 進階 Schema 技巧

#### 條件驗證

```typescript
const UserSchema = z
  .object({
    age: z.number().optional(),
    isAdult: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.age && data.age >= 18) {
        return data.isAdult === true;
      }
      return true;
    },
    {
      message: '成年人必須設定 isAdult 為 true',
      path: ['isAdult'],
    },
  );
```

#### 轉換 (Transform)

```typescript
const DateSchema = z.string().transform((str) => new Date(str));
const NumberStringSchema = z.string().transform((str) => parseFloat(str));
```

#### 可選與預設值

```typescript
z.string().optional(); // 可選
z.string().nullable(); // 可為 null
z.string().default('預設值'); // 預設值
z.string().optional().default('預設值'); // 可選且有預設值
```

## ⚙️ API 配置管理

### 環境變數配置

本專案使用 `.env` 文件來管理不同環境的配置，避免將配置硬編碼在程式碼中。

#### 配置文件結構

```
├── .env                    # 預設配置
├── .env.development        # 開發環境配置
├── .env.docker            # Docker 環境配置
└── .env.production        # 生產環境配置
```

#### 環境變數說明

```bash
# API 相關配置
API_ENV=development         # 環境名稱: development/docker/production
API_BASE_URL=/mock          # API 基礎 URL
API_USE_MOCK=true          # 是否使用 Mock 資料
API_TIMEOUT=5000           # API 超時時間 (毫秒)

# 應用程式配置
APP_NAME=Nuxt Service Demo  # 應用程式名稱
APP_VERSION=1.0.0          # 應用程式版本
```

### 配置管理架構

#### 1. Nuxt 配置層 (`nuxt.config.ts`)

```typescript
runtimeConfig: {
  // 私有配置 (僅伺服器端)
  apiSecret: process.env.API_SECRET,
  databaseUrl: process.env.DATABASE_URL,

  // 公開配置 (客戶端 + 伺服器端)
  public: {
    apiEnv: process.env.API_ENV || 'development',
    apiBaseUrl: process.env.API_BASE_URL || '/mock',
    apiUseMock: process.env.API_USE_MOCK === 'true',
    apiTimeout: parseInt(process.env.API_TIMEOUT || '5000'),
    appName: process.env.APP_NAME || 'Nuxt Service Demo',
    appVersion: process.env.APP_VERSION || '1.0.0',
  },
}
```

#### 2. 配置驗證層 (`composables/useConfigValidation.ts`)

使用 Zod 驗證配置格式：

```typescript
export const ApiConfigSchema = z.object({
  environment: z.enum(['development', 'docker', 'production']),
  baseURL: z.string().url().or(z.string().startsWith('/')),
  useMock: z.boolean(),
  timeout: z.number().positive(),
});
```

#### 3. 應用配置層 (`composables/useAppConfig.ts`)

```typescript
export const useAppConfig = (): AppConfigType => {
  const config = useRuntimeConfig();
  const rawConfig = {
    api: {
      /* API 配置 */
    },
    app: {
      /* 應用配置 */
    },
  };
  // 驗證並回傳配置
  return validateConfig(AppConfigSchema, rawConfig);
};
```

### 環境切換方式

#### 使用 npm 腳本

```bash
npm run dev              # 開發環境 (使用 .env.development)
npm run dev:docker       # Docker 環境 (使用 .env.docker)
npm run dev:production   # 生產環境 (使用 .env.production)
```

#### 直接設定環境變數

```bash
API_ENV=docker npm run dev
API_BASE_URL=http://localhost:8080/api npm run dev
```

### 配置最佳實踐

#### 1. 環境隔離

- 開發環境使用 Mock 資料
- 測試環境使用本地 API
- 生產環境使用遠端 API

#### 2. 敏感資訊管理

```typescript
// 私有配置 (不會暴露到客戶端)
runtimeConfig: {
  apiSecret: process.env.API_SECRET,
  databaseUrl: process.env.DATABASE_URL,
}

// 公開配置 (會暴露到客戶端)
runtimeConfig: {
  public: {
    apiBaseUrl: process.env.API_BASE_URL,
  }
}
```

#### 3. 配置驗證

- 使用 Zod Schema 驗證配置格式
- 提供預設值避免配置遺失
- 在應用啟動時驗證關鍵配置

#### 4. 型別安全

```typescript
export type ApiConfig = z.infer<typeof ApiConfigSchema>;

// 使用時有完整的型別支援
const apiConfig: ApiConfig = useApiConfig();
```

## 💡 最佳實踐

### 1. Schema 設計最佳實踐

- **單一職責**: 每個 Schema 只負責一個實體
- **可重用性**: 使用 `pick`、`omit`、`extend` 等方法重用 Schema
- **清晰錯誤訊息**: 提供有意義的中文錯誤訊息
- **版本控制**: 考慮 Schema 版本控制和向後兼容

### 2. API 服務最佳實踐

- **錯誤處理**: 統一的錯誤處理機制
- **日誌記錄**: 適當的日誌記錄用於除錯
- **快取策略**: 考慮實作適當的快取機制
- **重試機制**: 對於關鍵 API 考慮重試機制

### 3. 類型安全最佳實踐

- **嚴格模式**: 啟用 TypeScript 嚴格模式
- **型別推導**: 盡量使用 Zod 的型別推導而非手動定義
- **運行時驗證**: 所有外部資料都應通過 Zod 驗證
- **開發時檢查**: 使用 ESLint 和 TypeScript 檢查

### 4. 效能最佳實踐

- **Lazy Loading**: 按需載入 Schema 和 API 服務
- **樹搖優化**: 確保未使用的程式碼不會被打包
- **快取 Schema**: 避免重複建立相同的 Schema
- **批次請求**: 合併多個相關 API 請求

## 🎯 總結

這個架構提供了：

1. **完整的型別安全**: 從前端到後端的完整型別覆蓋
2. **靈活的環境管理**: 輕鬆切換開發、測試、生產環境
3. **強大的資料驗證**: 運行時和編譯時的雙重保護
4. **清晰的分層架構**: 易於維護和擴展的程式碼結構
5. **實際可用的範例**: 直接可運行的完整示範

透過這個架構，開發者可以建立出更可靠、更易維護的 Nuxt 3 應用程式。
