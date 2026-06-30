<!-- src/views/Login.vue -->
<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">登录旅游行程智能规划系统</h1>
        <p class="login-subtitle">欢迎回来，请登录您的账户</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
            @input="clearError"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码（至少6位）"
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
              v-model="loginForm.captcha"
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

        <!-- 记住我和忘记密码 -->
        <div class="login-options">
          <div class="remember-me">
            <el-checkbox v-model="rememberMe" label="记住我" size="large" />
          </div>
          <div class="forgot-password">
            <el-button type="text" size="small" @click="handleForgotPassword">
              忘记密码？
            </el-button>
          </div>
        </div>

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
            class="login-button"
            :loading="isLoading"
            @click="handleLogin"
          >
            {{ isLoading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>

        <!-- 注册链接 -->
        <div class="register-link">
          还没有账户？
          <router-link to="/register" class="link">立即注册</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Key, Warning } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth.store'
import { generateCaptcha } from '@/services/auth.service'
import { validateUsername, validatePassword, validateCaptcha } from '@/utils/validators'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const loginFormRef = ref()

// 响应式数据
const loginForm = reactive({
  username: '',
  password: '',
  captcha: '',
})

const captchaImage = ref('')
const captchaCode = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const rememberMe = ref(false)

// 验证规则
const loginRules = {
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
  loginForm.captcha = ''
  clearError()
}

// 清除错误信息
const clearError = () => {
  errorMessage.value = ''
}

// 处理忘记密码
const handleForgotPassword = () => {
  // 这里可以实现忘记密码的逻辑
  // 例如：跳转到忘记密码页面或显示忘记密码对话框
  console.log('忘记密码功能被点击')

  // 临时实现：显示提示信息
  errorMessage.value = '忘记密码功能开发中，请联系管理员重置密码'

  // 在实际项目中，可以这样跳转：
  // router.push({ name: 'forgot-password' })
}

// 处理登录
const handleLogin = async () => {
  console.log('handleLogin invoked', { loginForm: { ...loginForm }, rememberMe: rememberMe.value })
  try {
    if (!loginFormRef.value) {
      errorMessage.value = '表单未就绪，请稍后重试'
      return
    }
    await loginFormRef.value.validate()

    if (loginForm.captcha !== captchaCode.value) {
      errorMessage.value = '验证码不正确'
      refreshCaptcha()
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    // 如果选择了记住我，保存用户名到本地存储
    if (rememberMe.value) {
      localStorage.setItem('rememberedUsername', loginForm.username)
    } else {
      // 如果没有选择记住我，清除保存的用户名
      localStorage.removeItem('rememberedUsername')
    }

    // 模拟登录（暂时使用模拟数据）
    const result = await authStore.login({
      username: loginForm.username,
      password: loginForm.password,
    })

    console.log('authStore.login result', result)
    if (result && result.success) {
      // 如果登录成功且选择了记住我，保存记住我状态
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberMe')
      }

      // 登录成功，跳转到首页
      router.push({ name: 'home' })
    } else {
      errorMessage.value = (result && result.message) || '登录失败'
      refreshCaptcha()
    }
  } catch (error) {
    console.error('登录验证失败:', error)
    errorMessage.value = '请检查表单输入'
  } finally {
    isLoading.value = false
  }
}

// 页面加载时初始化验证码和检查记住我的状态
onMounted(() => {
  initCaptcha()

  // 检查是否有记住的用户名
  const rememberedUsername = localStorage.getItem('rememberedUsername')
  if (rememberedUsername) {
    loginForm.username = rememberedUsername
    rememberMe.value = true
  }

  // 使用nextTick确保DOM已渲染
  nextTick(() => {
    // 使用原生JavaScript实现淡入效果
    const loginCard = document.querySelector('.login-card')
    if (loginCard) {
      loginCard.style.opacity = '0'
      loginCard.style.transition = 'opacity 0.5s ease'
      setTimeout(() => {
        loginCard.style.opacity = '1'
      }, 100)
    }

    // 检查 jQuery 并安全绑定（带命名空间）
    const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
    if ($) {
      try {
        console.log('jQuery已加载，版本:', $.fn && $.fn.jquery)
        // 验证码图片点击效果
        $('.captcha-image').on('click.login', function () {
          $(this).css('transform', 'scale(0.95)')
          setTimeout(() => {
            $(this).css('transform', 'scale(1)')
          }, 150)
        })

        // 输入框焦点效果
        $('input')
          .on('focus.login', function () {
            $(this).css('border-color', '#409eff')
          })
          .on('blur.login', function () {
            $(this).css('border-color', '#dcdfe6')
          })

        // 忘记密码按钮悬停效果
        $('.forgot-password .el-button')
          .on('mouseenter.login', function () {
            $(this).css('color', '#409eff')
          })
          .on('mouseleave.login', function () {
            $(this).css('color', '')
          })

        console.log('jQuery效果已成功应用')
      } catch (error) {
        console.warn('jQuery执行出错:', error)
        setupNativeEffects()
      }
    } else {
      console.warn('jQuery未加载，使用原生JavaScript')
      setupNativeEffects()
    }
  })
})

onBeforeUnmount(() => {
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      $('.captcha-image').off('.login')
      $('input').off('.login')
      $('.forgot-password .el-button').off('.login')
    } catch (error) {
      console.warn('卸载 Login jQuery 事件时出错:', error)
    }
  }
})

// 原生JavaScript效果
const setupNativeEffects = () => {
  // 验证码图片点击效果
  const captchaImages = document.querySelectorAll('.captcha-image')
  captchaImages.forEach((img) => {
    img.addEventListener('click', function () {
      this.style.transform = 'scale(0.95)'
      setTimeout(() => {
        this.style.transform = 'scale(1)'
      }, 150)
    })
  })

  // 输入框焦点效果
  const inputs = document.querySelectorAll('input')
  inputs.forEach((input) => {
    input.addEventListener('focus', function () {
      this.style.borderColor = '#409eff'
    })
    input.addEventListener('blur', function () {
      this.style.borderColor = '#dcdfe6'
    })
  })

  // 忘记密码按钮悬停效果
  const forgotPasswordBtn = document.querySelector('.forgot-password .el-button')
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('mouseenter', function () {
      this.style.color = '#409eff'
    })
    forgotPasswordBtn.addEventListener('mouseleave', function () {
      this.style.color = ''
    })
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--bg-page) 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.login-form {
  width: 100%;
}

:deep(.el-input__wrapper) {
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
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

/* 记住我和忘记密码样式 */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me :deep(.el-checkbox__label) {
  color: var(--text-secondary);
  font-size: 14px;
}

.remember-me :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.forgot-password {
  display: flex;
  align-items: center;
}

.forgot-password .el-button {
  padding: 4px 0;
  font-size: 14px;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.forgot-password .el-button:hover {
  color: var(--primary-color);
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

.login-button {
  width: 100%;
  margin-top: 10px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  height: 48px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

.register-link .link {
  color: var(--primary-color);
  font-weight: 500;
  margin-left: 5px;
}

.register-link .link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .captcha-container {
    flex-direction: column;
    align-items: stretch;
  }

  .captcha-image {
    align-self: center;
  }

  .login-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .forgot-password {
    align-self: flex-end;
  }
}
</style>
