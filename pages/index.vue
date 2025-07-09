<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <!-- 主標題 -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          🚀 Nuxt 3 專案示範
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          探索我們的 Nuxt 3 + Zod + Service 架構，體驗現代化的前端開發流程
        </p>
      </div>

      <!-- 導航卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <!-- Data Flow Demo 卡片 -->
        <NuxtLink
          to="/data-flow-demo"
          class="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border border-gray-200"
        >
          <div class="flex items-center mb-6">
            <div class="bg-blue-500 text-white p-3 rounded-lg mr-4">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <h2
              class="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors"
            >
              📊 資料流程示範
            </h2>
          </div>

          <p class="text-gray-600 mb-6 leading-relaxed">
            深入了解 Nuxt 3 + Zod + Service 架構的完整資料流程，包含 API
            呼叫、資料驗證、狀態管理等功能。
          </p>

          <div class="space-y-2 mb-6">
            <div class="flex items-center text-sm text-gray-500">
              <span class="w-2 h-2 bg-green-400 rounded-full mr-2" />
              完整的 CRUD 操作示範
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span class="w-2 h-2 bg-green-400 rounded-full mr-2" />
              Zod Schema 驗證測試
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span class="w-2 h-2 bg-green-400 rounded-full mr-2" />
              多環境配置展示
            </div>
          </div>

          <div
            class="flex items-center text-blue-500 font-medium group-hover:text-blue-700"
          >
            前往探索
            <svg
              class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </NuxtLink>

        <!-- Tailwind CSS Demo 卡片 -->
        <NuxtLink
          to="/tailwindCss-demo"
          class="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border border-gray-200"
        >
          <div class="flex items-center mb-6">
            <div
              class="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3 rounded-lg mr-4"
            >
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <h2
              class="text-2xl font-bold text-gray-800 group-hover:text-cyan-600 transition-colors"
            >
              🎨 Tailwind CSS 測試
            </h2>
          </div>

          <p class="text-gray-600 mb-6 leading-relaxed">
            體驗 Tailwind CSS
            的強大功能，查看各種樣式元件、顏色系統、響應式設計等實際應用。
          </p>

          <div class="space-y-2 mb-6">
            <div class="flex items-center text-sm text-gray-500">
              <span class="w-2 h-2 bg-cyan-400 rounded-full mr-2" />
              豐富的顏色和樣式測試
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span class="w-2 h-2 bg-cyan-400 rounded-full mr-2" />
              響應式設計展示
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span class="w-2 h-2 bg-cyan-400 rounded-full mr-2" />
              互動元件範例
            </div>
          </div>

          <div
            class="flex items-center text-cyan-500 font-medium group-hover:text-cyan-700"
          >
            查看樣式
            <svg
              class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </NuxtLink>
      </div>

      <!-- 專案特色 -->
      <div class="mt-20 text-center">
        <h3 class="text-2xl font-bold text-gray-800 mb-8">🌟 專案特色</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-3xl mb-4">⚡</div>
            <h4 class="font-bold text-gray-800 mb-2">高效能</h4>
            <p class="text-gray-600 text-sm">
              Nuxt 3 + Vite 提供極速的開發體驗
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-3xl mb-4">🔒</div>
            <h4 class="font-bold text-gray-800 mb-2">型別安全</h4>
            <p class="text-gray-600 text-sm">TypeScript + Zod 確保程式碼品質</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-3xl mb-4">🎯</div>
            <h4 class="font-bold text-gray-800 mb-2">架構清晰</h4>
            <p class="text-gray-600 text-sm">Service 層設計，易於維護擴展</p>
          </div>
        </div>
      </div>

      <!-- 底部資訊 -->
      <div class="mt-16 text-center text-gray-500">
        <p class="text-sm">
          Built with ❤️ using Nuxt 3, TypeScript, Tailwind CSS & Zod
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 手動導入需要的功能
import { NuxtLink } from '#components';
import { useHead } from '#app';

// 設定頁面 meta
useHead({
  title: 'Nuxt 3 專案示範',
  meta: [
    {
      name: 'description',
      content: '探索 Nuxt 3 + Zod + Service 架構的現代化前端開發專案',
    },
  ],
});
</script>

<style scoped>
/* 可以添加額外的自定義樣式，但主要使用 Tailwind CSS */
.container {
  max-width: 1200px;
}

/* 為卡片添加微妙的動畫效果 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.group:hover {
  animation: float 2s ease-in-out infinite;
}
</style>
