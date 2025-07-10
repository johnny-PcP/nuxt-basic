<script setup lang="ts">
import type { CreateUserInput, User } from '~/service/schema/user'
// 手動 import 需要的功能
import { computed, onMounted, ref } from 'vue'
import { useProjectConfig } from '~/composables/useProjectConfig'
import { userApi } from '~/service/api/user'
// 取得專案配置
const projectConfig = computed(() => useProjectConfig())

// 響應式資料
const users = ref<User[]>([])
const loading = ref(false)
const creating = ref(false)
const error = ref('')

// 新用戶表單資料
const newUser = ref<CreateUserInput>({
  name: '',
  email: '',
  age: undefined,
  isActive: true,
})

// Zod 驗證測試
const testData = ref(
  '{"id": 1, "name": "測試用戶", "email": "test@example.com", "age": 25, "isActive": true}',
)
const validationResult = ref<string>('')

// 清空用戶列表
function clearUsers() {
  users.value = []
}

// 載入用戶列表
async function loadUsers() {
  loading.value = true
  error.value = ''

  try {
    users.value = await userApi.getUsers()

    // 只在非正式環境中記錄詳細信息
    if (projectConfig.value.environment !== 'production') {
      console.log('載入的用戶:', users.value)
      console.log('使用配置:', projectConfig.value)
    }
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '未知錯誤'

    // 只在非正式環境中記錄錯誤詳情
    if (projectConfig.value.environment !== 'production') {
      console.error('載入用戶失敗:', err)
    }
  }
  finally {
    loading.value = false
  }
}

// 載入單一用戶
async function loadSingleUser(id: number): Promise<void> {
  try {
    const user = await userApi.getUserById(id)
    if (user) {
      // 只在非正式環境中記錄詳細信息
      if (projectConfig.value.environment !== 'production') {
        console.log('載入的單一用戶:', user)
      }

      // 更新列表中的用戶
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = user
      }
    }
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '載入用戶失敗'
  }
}

// 創建新用戶
async function createNewUser() {
  creating.value = true
  error.value = ''

  try {
    const createdUser = await userApi.createUser(newUser.value)

    // 只在非正式環境中記錄詳細信息
    if (projectConfig.value.environment !== 'production') {
      console.log('創建的用戶:', createdUser)
    }

    // 添加到列表
    users.value.push(createdUser)

    // 重置表單
    newUser.value = {
      name: '',
      email: '',
      age: undefined,
      isActive: true,
    }
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '創建用戶失敗'

    // 只在非正式環境中記錄錯誤詳情
    if (projectConfig.value.environment !== 'production') {
      console.error('創建用戶失敗:', err)
    }
  }
  finally {
    creating.value = false
  }
}

// 設定驗證範例
function setValidExample() {
  testData.value = JSON.stringify(
    {
      id: 1,
      name: '有效用戶',
      email: 'valid@example.com',
      age: 30,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    null,
    2,
  )
}

function setMinimalExample() {
  testData.value = JSON.stringify(
    {
      id: 2,
      name: '最少資料用戶',
      email: 'minimal@example.com',
      isActive: false,
      // age 和 createdAt 是可選的
    },
    null,
    2,
  )
}

function setInvalidExample() {
  testData.value = JSON.stringify(
    {
      id: '不是數字', // 錯誤：id 應該是數字
      name: '', // 錯誤：name 不能為空
      email: '不是email格式', // 錯誤：email 格式錯誤
      age: -5, // 錯誤：age 不能小於1
      isActive: '不是布林值', // 錯誤：isActive 應該是布林值
      createdAt: '不是有效日期格式', // 錯誤：日期格式錯誤
    },
    null,
    2,
  )
}

function setPartialExample() {
  testData.value = JSON.stringify(
    {
      id: 3,
      name: '部分資料用戶',
      email: 'partial@example.com',
      // 缺少 age (可選)、isActive (必需) 和 createdAt (可選)
      // 這會導致 isActive 缺失的錯誤
    },
    null,
    2,
  )
}

// 測試 Zod 驗證
function testValidation() {
  try {
    const data = JSON.parse(testData.value)

    const result = userApi.validateUser(data)

    if (result.success && result.data) {
      validationResult.value = `✅ ${
        result.summary || '驗證成功'
      }\n\n驗證後的資料:\n${JSON.stringify(result.data, null, 2)}`
    }
    else {
      // 顯示詳細的錯誤信息
      let errorMessage = `❌ ${result.summary || '驗證失敗'}`

      if (result.errors && result.errors.length > 0) {
        errorMessage += '\n\n詳細錯誤:'
        result.errors.forEach((err, index) => {
          errorMessage += `\n${index + 1}. ${err.field}: ${err.message}`
        })
      }
      else if (result.error) {
        errorMessage += `\n\n錯誤訊息: ${result.error}`
      }

      validationResult.value = errorMessage
    }
  }
  catch (err) {
    // 只在非正式環境中記錄 JSON 解析錯誤
    if (projectConfig.value.environment !== 'production') {
      console.error('JSON 解析錯誤:', err)
    }

    validationResult.value = `❌ JSON 解析失敗:\n${

      err instanceof Error ? err.message : '未知錯誤'
    }`
  }
}

// 日期格式化
function formatDate(dateString?: string): string {
  if (!dateString)
    return '未提供'
  return new Date(dateString).toLocaleString('zh-TW')
}

// 組件載入時自動載入用戶
onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="container">
    <h1 class="page-title">
      Nuxt 3 + Zod + Service 資料流DEMO
    </h1>

    <!-- API 配置資訊 -->
    <div class="config-section">
      <h2>🔧 應用程式配置</h2>

      <!-- 應用資訊 -->
      <div class="config-card">
        <h3 class="card-title">
          📱 應用資訊
        </h3>
        <p>
          <strong>除錯模式:</strong>
          {{ projectConfig.appDebug ? '開啟' : '關閉' }}
        </p>
      </div>

      <!-- API 配置 -->
      <div class="config-card">
        <h3 class="card-title">
          🌐 API 配置
        </h3>
        <p>
          <strong>環境:</strong>
          <span
            :class="{
              'env-production': projectConfig.environment === 'production',
              'env-docker': projectConfig.environment === 'docker',
              'env-development': projectConfig.environment === 'development',
            }"
            class="env-badge"
          >
            {{ projectConfig.environment }}
          </span>
        </p>
        <p>
          <strong>Base URL:</strong>
          <code class="code-inline">{{ projectConfig.baseURL }}</code>
        </p>
        <p>
          <strong>環境狀態:</strong>
          <span
            :class="{
              'status-active': projectConfig.environment === 'development',
              'status-inactive': projectConfig.environment !== 'development',
            }"
            class="status-badge"
          >
            {{
              projectConfig.environment === 'development'
                ? '✅ Mock 模式'
                : '❌ 真實 API'
            }}
          </span>
        </p>
        <p><strong>超時設定:</strong> {{ projectConfig.timeout }}ms</p>
      </div>

      <div class="environment-guide">
        <p><strong>💡 環境切換方法:</strong></p>
        <ul class="env-list">
          <li><code>npm run dev</code> - 開發環境 (Mock 資料)</li>
          <li><code>npm run dev:docker</code> - Docker 環境 (本地 API)</li>
          <li><code>npm run dev:production</code> - 生產環境 (遠端 API)</li>
        </ul>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="main-content">
      <!-- 用戶列表區域 -->
      <div class="section user-list-section">
        <h2>👥 用戶列表</h2>
        <div class="button-group">
          <button
            :disabled="loading"
            class="btn btn-primary"
            @click="loadUsers"
          >
            {{ loading ? '載入中...' : '載入用戶' }}
          </button>
          <button
            class="btn btn-danger"
            @click="clearUsers"
          >
            清空列表
          </button>
        </div>

        <div
          v-if="users.length > 0"
          class="user-list"
        >
          <div
            v-for="user in users"
            :key="user.id"
            class="user-card"
          >
            <h3 class="user-name">
              {{ user.name }}
            </h3>
            <p><strong>資料ID:</strong> {{ user.id }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>年齡:</strong> {{ user.age || '未提供' }}</p>
            <p>
              <strong>狀態:</strong>
              <span
                :class="{
                  'status-active': user.isActive,
                  'status-inactive': !user.isActive,
                }"
                class="status-badge"
              >
                {{ user.isActive ? '✅ 活躍' : '❌ 非活躍' }}
              </span>
            </p>
            <p><strong>建立時間:</strong> {{ formatDate(user.createdAt) }}</p>
            <button
              class="btn btn-secondary"
              @click="loadSingleUser(user.id)"
            >
              重新載入此用戶
            </button>
          </div>
        </div>

        <div
          v-else-if="!loading"
          class="empty-state"
        >
          <p>📝 暫無用戶資料，請點擊「載入用戶」按鈕</p>
        </div>
      </div>

      <!-- 創建用戶區域 -->
      <div class="section create-user-section">
        <h2>➕ 創建新用戶</h2>
        <form
          class="user-form"
          @submit.prevent="createNewUser"
        >
          <div class="form-group">
            <label class="form-label">姓名:</label>
            <input
              v-model="newUser.name"
              type="text"
              required
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Email:</label>
            <input
              v-model="newUser.email"
              type="email"
              required
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label class="form-label">年齡:</label>
            <input
              v-model.number="newUser.age"
              type="number"
              min="0"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="newUser.isActive"
                type="checkbox"
                class="checkbox-input"
              >
              活躍狀態
            </label>
          </div>

          <button
            type="submit"
            :disabled="creating"
            class="btn btn-success btn-full"
          >
            {{ creating ? '創建中...' : '創建用戶' }}
          </button>
        </form>
      </div>
    </div>

    <!-- 錯誤信息 -->
    <div
      v-if="error"
      class="error-message"
    >
      <h3 class="error-title">
        ❌ 錯誤信息:
      </h3>
      <p class="error-content">
        {{ error }}
      </p>
    </div>

    <!-- Zod 驗證示例 -->
    <div class="section">
      <h2>🔍 Zod 驗證示例</h2>
      <p>嘗試輸入不同的 JSON 資料來測試 Zod Schema 驗證:</p>

      <div class="validation-content">
        <!-- 左側：測試輸入區域 -->
        <div class="validation-input-section">
          <div class="validation-controls">
            <h4>測試範例:</h4>
            <div class="example-buttons">
              <button
                class="btn btn-success btn-sm"
                @click="setValidExample"
              >
                完整有效資料
              </button>
              <button
                class="btn btn-info btn-sm"
                @click="setMinimalExample"
              >
                最少有效資料
              </button>
              <button
                class="btn btn-warning btn-sm"
                @click="setPartialExample"
              >
                部分資料
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="setInvalidExample"
              >
                無效資料
              </button>
            </div>
          </div>

          <textarea
            v-model="testData"
            placeholder="輸入 JSON 資料來測試驗證"
            class="validation-textarea"
          />

          <button
            class="btn btn-secondary btn-full"
            @click="testValidation"
          >
            測試驗證
          </button>
        </div>

        <!-- 右側：驗證結果區域 -->
        <div class="validation-result-section">
          <h4>驗證結果:</h4>
          <div
            v-if="validationResult"
            class="validation-result"
          >
            <pre class="result-pre">{{ validationResult }}</pre>
          </div>
          <div
            v-else
            class="validation-placeholder"
          >
            <p>👆 點擊左側的「測試驗證」按鈕來查看結果</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
/* 容器和佈局 */
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  line-height: 1.6;
}

.page-title {
  color: #1f2937;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

.section {
  margin-bottom: 30px;
}

/* 主要內容區域 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  align-items: start;
}

.user-list-section {
  min-height: 400px;
}

.create-user-section {
  position: sticky;
  top: 20px;
}

/* 配置區域 */
.config-section {
  margin-bottom: 30px;
  padding: 15px;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #0ea5e9;
}

.config-card {
  margin-bottom: 15px;
  padding: 10px;
  background: white;
  border-radius: 6px;
}

.card-title {
  margin: 0 0 10px 0;
  color: #1f2937;
  font-size: 1.1rem;
}

/* 環境標籤 */
.env-badge {
  font-weight: bold;
}

.env-production {
  color: #ef4444;
}

.env-docker {
  color: #f59e0b;
}

.env-development {
  color: #10b981;
}

/* 代碼內聯 */
.code-inline {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9rem;
}

/* 狀態標籤 */
.status-badge {
  font-weight: 500;
}

.status-active {
  color: #10b981;
}

.status-inactive {
  color: #ef4444;
}

/* 環境指南 */
.environment-guide {
  margin-top: 15px;
  font-size: 14px;
  color: #6b7280;
}

.env-list {
  margin: 5px 0;
  padding-left: 20px;
}

.env-list code {
  background: #f3f4f6;
  padding: 1px 4px;
  border-radius: 2px;
  font-family: monospace;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-secondary {
  background: #8b5cf6;
  color: white;
  margin-top: 15px;
  padding: 8px 16px;
  font-size: 13px;
}

.btn-secondary:hover:not(:disabled) {
  background: #7c3aed;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-info {
  background: #6366f1;
  color: white;
}

.btn-info:hover {
  background: #5b21b6;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
}

.btn-full {
  width: 100%;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.example-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

/* 用戶列表 */
.user-list {
  margin-top: 20px;
  display: grid;
  gap: 15px;
}

.user-card {
  border: 1px solid #e5e7eb;
  padding: 20px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.user-card:hover {
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.user-name {
  margin: 0 0 15px 0;
  color: #1f2937;
  font-size: 1.3rem;
  font-weight: 600;
}

.user-card p {
  margin: 8px 0;
  color: #4b5563;
}

/* 空狀態 */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px dashed #d1d5db;
}

/* 表單樣式 */
.user-form {
  padding: 25px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.user-form:hover {
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #ffffff;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: #ffffff;
}

.form-input:hover {
  border-color: #9ca3af;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-input {
  margin-right: 8px;
  cursor: pointer;
}

/* 錯誤訊息 */
.error-message {
  color: white;
  background: #ef4444;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  border-left: 4px solid #dc2626;
}

.error-title {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
}

.error-content {
  margin: 0;
  opacity: 0.9;
}

/* 驗證區域 */
.validation-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 20px;
}

.validation-input-section {
  display: flex;
  flex-direction: column;
}

.validation-result-section {
  display: flex;
  flex-direction: column;
}

.validation-result-section h4 {
  margin: 0 0 15px 0;
  color: #1f2937;
  font-size: 1.1rem;
}

.validation-controls {
  margin-bottom: 20px;
}

.validation-controls h4 {
  margin: 0 0 10px 0;
  color: #1f2937;
  font-size: 1rem;
}

.validation-textarea {
  width: 100%;
  height: 200px;
  padding: 15px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  resize: vertical;
  margin-bottom: 15px;
  font-size: 13px;
  line-height: 1.4;
}

.validation-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.validation-result {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.validation-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px dashed #d1d5db;
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.result-pre {
  background: #f3f4f6;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  border: 1px solid #e5e7eb;
  flex: 1;
  min-height: 200px;
  line-height: 1.4;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .main-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .create-user-section {
    position: static;
    order: -1;
  }

  .validation-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .validation-result-section {
    order: -1;
  }

  .button-group {
    flex-direction: column;
    gap: 10px;
  }

  .btn {
    width: 100%;
  }

  .example-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .config-section {
    padding: 10px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .validation-textarea {
    height: 150px;
  }
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr 350px;
    gap: 25px;
  }

  .validation-content {
    grid-template-columns: 1fr;
    gap: 25px;
  }
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

.user-card,
.config-card,
.user-form {
  animation: fadeIn 0.3s ease-out;
}

/* 載入狀態 */
.btn:disabled {
  position: relative;
  overflow: hidden;
}

.btn:disabled::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
