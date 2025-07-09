import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  components: false, // 禁用自動導入 components
  imports: {
    autoImport: false, // 禁用自動導入 composables 和 utils
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/icon',
  ],
  // 運行時配置
  runtimeConfig: {
    // 私有配置 (僅在伺服器端可用)
    apiSecret: process.env.API_SECRET,
    databaseUrl: process.env.DATABASE_URL,

    // 公開配置 (客戶端和伺服器端都可用)
    public: {
      // API 相關配置
      apiEnv: process.env.API_ENV || 'development',
      apiBaseUrl: process.env.API_BASE_URL || '/mock',
      apiUseMock: process.env.API_USE_MOCK === 'true',
      apiTimeout: parseInt(process.env.API_TIMEOUT || '5000'),

      // 應用程式配置
      appName: process.env.APP_NAME || 'Nuxt Service Demo',
      appVersion: process.env.APP_VERSION || '1.0.0',
      appDebug: process.env.NODE_ENV === 'development',
    },
  },

  //  ts 設定
  typescript: {
    // strict: true, // 啟用嚴格模式
    // typeCheck: true, // 啟用即時類型檢查
  },
});
