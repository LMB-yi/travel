// src/stores/auth.store.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  
  // 状态
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = computed(() => !!token.value)

  // 从localStorage初始化
  if (token.value) {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        user.value = JSON.parse(userData)
      }
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error)
      clearAuth()
    }
  }

  // 动作
  const setAuth = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials)
      if (response.success) {
        setAuth(response.data.user, response.data.token)
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: error.message || '登录失败，请稍后重试' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData)
      if (response.success) {
        setAuth(response.data.user, response.data.token)
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, message: error.message || '注册失败，请稍后重试' }
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
      router.push({ name: 'login' })
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await getProfile()
      if (response.success) {
        user.value = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
      return { success: false, message: error.message || '获取用户信息失败' }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    clearAuth,
    setAuth,
    fetchProfile
  }
})