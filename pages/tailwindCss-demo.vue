<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-center text-gray-900 mb-8">
        Tailwind CSS 測試頁面
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 class="text-xl font-semibold text-gray-800 mb-4">顏色測試</h2>
          <div class="flex space-x-2 mb-4">
            <div class="w-8 h-8 bg-red-500 rounded"></div>
            <div class="w-8 h-8 bg-blue-500 rounded"></div>
            <div class="w-8 h-8 bg-green-500 rounded"></div>
            <div class="w-8 h-8 bg-yellow-500 rounded"></div>
          </div>
          <p class="text-gray-600">測試各種 Tailwind 顏色</p>
        </div>

        <div
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 class="text-xl font-semibold text-gray-800 mb-4">按鈕測試</h2>
          <div class="space-y-2">
            <button
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              主要按鈕
            </button>
            <button
              class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
            >
              次要按鈕
            </button>
          </div>
        </div>

        <div
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 class="text-xl font-semibold text-gray-800 mb-4">響應式測試</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div class="bg-purple-100 p-2 text-center text-sm rounded">1</div>
            <div class="bg-purple-200 p-2 text-center text-sm rounded">2</div>
            <div class="bg-purple-300 p-2 text-center text-sm rounded">3</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
