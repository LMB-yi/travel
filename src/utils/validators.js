// src/utils/validators.js
// 用户名验证：4-20位，字母数字下划线
export const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]{4,20}$/
  return regex.test(username)
}

// 密码验证：至少6位
export const validatePassword = (password) => {
  return password.length >= 6
}

// 邮箱验证
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// 手机号验证
export const validatePhone = (phone) => {
  const regex = /^1[3-9]\d{9}$/
  return regex.test(phone)
}

// 验证码验证：4位数字
export const validateCaptcha = (captcha) => {
  const regex = /^\d{4}$/
  return regex.test(captcha)
}

// 行程标题验证：1-50个字符
export const validateTripTitle = (title) => {
  return title.length >= 1 && title.length <= 50
}

// 日期验证：结束日期不能早于开始日期
export const validateDates = (startDate, endDate) => {
  if (!startDate || !endDate) return true
  return new Date(endDate) >= new Date(startDate)
}

// 通用必填字段验证
export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}

// 价格验证：非负数字，最多两位小数
export const validatePrice = (price) => {
  if (price === '' || price === null || price === undefined) return true
  const regex = /^\d+(\.\d{1,2})?$/
  return regex.test(price.toString()) && parseFloat(price) >= 0
}

// 时间格式验证：HH:mm
export const validateTime = (time) => {
  if (!time) return true
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/
  return regex.test(time)
}

// 获取验证错误消息
export const getValidationMessage = (field, value, additional = {}) => {
  const messages = {
    username: validateUsername(value) ? '' : '用户名必须是4-20位的字母、数字或下划线',
    password: validatePassword(value) ? '' : '密码至少需要6位',
    email: validateEmail(value) ? '' : '请输入有效的邮箱地址',
    phone: validatePhone(value) ? '' : '请输入有效的手机号',
    captcha: validateCaptcha(value) ? '' : '验证码必须是4位数字',
    tripTitle: validateTripTitle(value) ? '' : '行程标题必须在1-50个字符之间',
    required: validateRequired(value) ? '' : '此字段为必填项',
    price: validatePrice(value) ? '' : '请输入有效的价格（非负数字，最多两位小数）',
    time: validateTime(value) ? '' : '时间格式应为 HH:mm'
  }

  if (field === 'dates' && additional.startDate && additional.endDate) {
    return validateDates(additional.startDate, additional.endDate) 
      ? '' 
      : '结束日期不能早于开始日期'
  }

  return messages[field] || ''
}