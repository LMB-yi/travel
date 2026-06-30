// src/services/user.service.js
import api from './api'

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData)
    return response
  } catch (error) {
    return error
  }
}

export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/users/password', passwordData)
    return response
  } catch (error) {
    return error
  }
}