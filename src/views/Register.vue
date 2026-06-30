<!-- src/views/Register.vue -->
<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1 class="register-title">注册新账户</h1>
        <p class="register-subtitle">创建您的旅游行程智能规划账户</p>
      </div>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
        @submit.prevent="handleRegister"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名（4-20位字母、数字、下划线）"
            size="large"
            :prefix-icon="User"
            @input="clearError"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            size="large"
            :prefix-icon="Lock"
            show-password
            @input="clearError"
          />
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            @input="clearError"
          />
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="captcha">
          <div class="captcha-container">
            <el-input
              v-model="registerForm.captcha"
              placeholder="请输入验证码"
              size="large"
              :prefix-icon="Key"
              @input="clearError"
            />
            <div class="captcha-image" @click="refreshCaptcha">
              <img :src="captchaImage" alt="验证码" />
              <div class="captcha-hint">点击刷新</div>
            </div>
          </div>
        </el-form-item>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="error-message">
          <el-icon><Warning /></el-icon>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="register-button"
            :loading="isLoading"
            @click="handleRegister"
          >
            {{ isLoading ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>

        <!-- 登录链接 -->
        <div class="login-link">
          已有账户？
          <router-link to="/login" class="link">立即登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Key, Warning } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth.store'
import { generateCaptcha } from '@/services/auth.service'
import { validateUsername, validatePassword, validateCaptcha } from '@/utils/validators'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const registerFormRef = ref()

// 响应式数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  captcha: '',
})

const captchaImage = ref('')
const captchaCode = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

// 验证规则
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!validateUsername(value)) {
          callback(new Error('用户名必须是4-20位的字母、数字或下划线'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!validatePassword(value)) {
          callback(new Error('密码至少需要6位'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!validateCaptcha(value)) {
          callback(new Error('验证码必须是4位数字'))
        } else if (value !== captchaCode.value) {
          callback(new Error('验证码不正确'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 初始化验证码
const initCaptcha = () => {
  const { code, image } = generateCaptcha()
  captchaCode.value = code
  captchaImage.value = image
}

// 刷新验证码
const refreshCaptcha = () => {
  initCaptcha()
  registerForm.captcha = ''
  clearError()
}

// 清除错误信息
const clearError = () => {
  errorMessage.value = ''
}

// 处理注册
const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()

    if (registerForm.captcha !== captchaCode.value) {
      errorMessage.value = '验证码不正确'
      refreshCaptcha()
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    const result = await authStore.register({
      username: registerForm.username,
      password: registerForm.password,
    })

    if (result.success) {
      // 注册成功：确保用户已登录（有时后端未返回会话信息），尝试自动登录后再跳转首页
      try {
        if (!authStore.isAuthenticated) {
          await authStore.login({
            username: registerForm.username,
            password: registerForm.password,
          })
        }
      } catch (e) {
        console.warn('自动登录失败：', e)
      }
      router.push({ name: 'home' })
    } else {
      errorMessage.value = result.message || '注册失败'
      refreshCaptcha()
    }
  } catch (error) {
    console.error('注册验证失败:', error)
    errorMessage.value = '请检查表单输入'
  } finally {
    isLoading.value = false
  }
}

// 页面加载时初始化验证码
onMounted(() => {
  initCaptcha()

  // 使用nextTick确保DOM已渲染
  nextTick(() => {
    // 淡入效果
    const registerCard = document.querySelector('.register-card')
    if (registerCard) {
      registerCard.style.opacity = '0'
      registerCard.style.transition = 'opacity 0.5s ease'
      setTimeout(() => {
        registerCard.style.opacity = '1'
      }, 100)
    }

    // jQuery效果（运行时安全的 $ 变量）
    const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
    if ($) {
      try {
        // 验证码图片点击效果
        $('.captcha-image').on('click', function () {
          $(this).css('transform', 'scale(0.95)')
          setTimeout(() => {
            $(this).css('transform', 'scale(1)')
          }, 150)
        })

        // 表单提交按钮动画
        $('.register-button').hover(
          function () {
            $(this).css('transform', 'translateY(-2px)')
          },
          function () {
            $(this).css('transform', 'translateY(0)')
          },
        )
      } catch (error) {
        console.warn('jQuery执行出错:', error)
      }
    }
  })
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--bg-page) 100%);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 420px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 40px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.register-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.register-form {
  width: 100%;
}

.captcha-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.captcha-image {
  cursor: pointer;
  position: relative;
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
}

.captcha-image:hover {
  transform: scale(1.02);
}

.captcha-image img {
  width: 100px;
  height: 40px;
  display: block;
}

.captcha-hint {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
  text-align: center;
  padding: 2px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.captcha-image:hover .captcha-hint {
  opacity: 1;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #fef0f0;
  border: 1px solid #fde2e2;
  border-radius: var(--radius-sm);
  color: #f56c6c;
  margin-bottom: 20px;
  font-size: 14px;
}

.error-message .el-icon {
  font-size: 16px;
}

.register-button {
  width: 100%;
  margin-top: 10px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  height: 48px;
  transition: transform var(--transition-fast);
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

.login-link .link {
  color: var(--primary-color);
  font-weight: 500;
  margin-left: 5px;
}

.login-link .link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 30px 20px;
  }

  .captcha-container {
    flex-direction: column;
    align-items: stretch;
  }

  .captcha-image {
    align-self: center;
  }
}
</style>
