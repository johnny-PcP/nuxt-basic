import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/icon',
  ],
  components: false, // 禁用自動導入 components
  imports: {
    autoImport: false, // 禁用自動導入 composables 和 utils
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  // 運行時配置
  runtimeConfig: {
    // 私有配置 (僅在伺服器端可用)
    apiSecret: process.env.API_SECRET,
    databaseUrl: process.env.DATABASE_URL,

    // 公開配置 (客戶端和伺服器端都可用)
    public: {
      // API 服務配置
      apiEnv: process.env.API_ENV || 'development',
      apiBaseUrl: process.env.API_BASE_URL || '/mock',
      apiTimeout: Number.parseInt(process.env.API_TIMEOUT || '5000'),

      // 應用程式狀態配置
      appDebug: process.env.NODE_ENV === 'development',
    },
  },
  compatibilityDate: '2025-05-15',
  vite: {
    plugins: [tailwindcss()],
  },

  eslint: {
    config: {
      stylistic: true, // 啟用風格檢查
    },
  },
})
