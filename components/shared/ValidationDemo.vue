<!--
  驗證示例組件

  負責顯示 Zod 驗證示例
-->
<script setup lang="ts">
import { ref } from 'vue'

// 組件 Props 型別定義
interface Props {
  projectConfig: any
}

defineProps<Props>()

// 本地狀態
const testData = ref('')
const validationResult = ref('')

// 驗證方法
function validateData() {
  if (!testData.value) {
    validationResult.value = '請輸入測試資料'
    return
  }

  try {
    const parsed = JSON.parse(testData.value)
    validationResult.value = `✅ 驗證成功: ${JSON.stringify(parsed, null, 2)}`
  }
  catch (error) {
    validationResult.value = `❌ 驗證失敗: ${error}`
  }
}
</script>

<template>
  <div class="section validation-section">
    <h2>🔍 Zod 驗證示例</h2>
    <div class="validation-demo">
      <div class="input-group">
        <label>測試資料 (JSON格式):</label>
        <textarea
          v-model="testData"
          placeholder="{&quot;name&quot;: &quot;測試&quot;, &quot;email&quot;: &quot;test@example.com&quot;}"
          class="test-input"
        />
        <button
          class="btn btn-primary"
          @click="validateData"
        >
          驗證資料
        </button>
      </div>

      <div
        v-if="validationResult"
        class="validation-result"
      >
        <pre>{{ validationResult }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section {
  margin-bottom: 30px;
}

.validation-demo {
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

.test-input {
  width: 100%;
  height: 100px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 10px;
}

.test-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.validation-result {
  margin-top: 20px;
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.validation-result pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
}

/* 按鈕樣式 */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

/* 動畫效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
