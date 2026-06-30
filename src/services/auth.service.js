// src/services/auth.service.js
import api from './api'

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials)
    return response
  } catch (error) {
    // 返回格式化的错误响应，确保与成功响应结构一致
    return {
      success: false,
      message: error.message || '登录失败，请稍后重试'
    }
  }
}

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData)
    return response
  } catch (error) {
    return {
      success: false,
      message: error.message || '注册失败，请稍后重试'
    }
  }
}

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout')
    return response
  } catch (error) {
    return {
      success: false,
      message: error.message || '登出失败，请稍后重试'
    }
  }
}

export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile')
    return response
  } catch (error) {
    return {
      success: false,
      message: error.message || '获取用户信息失败，请稍后重试'
    }
  }
}

// 模拟验证码生成（前端模拟）
export const generateCaptcha = () => {
  // 生成4位随机数字验证码
  const captcha = Math.floor(1000 + Math.random() * 9000).toString()
  return {
    code: captcha,
    image: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="40">
        <rect width="120" height="40" fill="#f5f5f5"/>
        <text x="60" y="25" font-family="Arial" font-size="20" text-anchor="middle" fill="#333">${captcha}</text>
      </svg>
    `)}`
  }
}