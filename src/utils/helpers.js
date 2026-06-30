// src/utils/helpers.js
import dayjs from 'dayjs'

// 格式化日期
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

// 格式化时间
export const formatTime = (time, format = 'HH:mm') => {
  if (!time) return ''
  return dayjs(`2024-01-01 ${time}`).format(format)
}

// 格式化货币
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '¥0.00'
  return `¥${parseFloat(amount).toFixed(2)}`
}

// 生成唯一ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 深度复制对象
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

// 防抖函数
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 节流函数
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 安全获取对象属性
export const safeGet = (obj, path, defaultValue = null) => {
  if (!obj) return defaultValue
  const keys = path.split('.')
  let result = obj
  for (const key of keys) {
    result = result?.[key]
    if (result === undefined) return defaultValue
  }
  return result
}

// 数组分页
export const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

// 计算行程总花费
export const calculateTotalCost = (tripItems) => {
  if (!tripItems || !Array.isArray(tripItems)) return 0
  return tripItems.reduce((total, item) => {
    const cost = parseFloat(item.estimated_cost) || 0
    return total + cost
  }, 0)
}

// 按天数分组行程项目
export const groupItemsByDay = (items) => {
  const grouped = {}
  items.forEach(item => {
    const day = item.day_number || 1
    if (!grouped[day]) {
      grouped[day] = []
    }
    grouped[day].push(item)
  })
  
  // 按时间排序
  Object.keys(grouped).forEach(day => {
    grouped[day].sort((a, b) => {
      const timeA = a.item_time || '00:00'
      const timeB = b.item_time || '00:00'
      return timeA.localeCompare(timeB)
    })
  })
  
  return grouped
}