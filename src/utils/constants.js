// src/utils/constants.js
// 行程类型
export const TRIP_TYPES = {
  LEISURE: 'leisure',      // 休闲度假
  BUSINESS: 'business',    // 商务出差
  ADVENTURE: 'adventure',  // 探险旅行
  FAMILY: 'family',        // 家庭旅游
  BACKPACKING: 'backpacking', // 背包客
  HONEYMOON: 'honeymoon'   // 蜜月旅行
}

// 行程类型显示名称
export const TRIP_TYPE_LABELS = {
  [TRIP_TYPES.LEISURE]: '休闲度假',
  [TRIP_TYPES.BUSINESS]: '商务出差',
  [TRIP_TYPES.ADVENTURE]: '探险旅行',
  [TRIP_TYPES.FAMILY]: '家庭旅游',
  [TRIP_TYPES.BACKPACKING]: '背包客',
  [TRIP_TYPES.HONEYMOON]: '蜜月旅行'
}

// 活动类型
export const ACTIVITY_TYPES = {
  SIGHTSEEING: 'sightseeing',  // 观光
  FOOD: 'food',                // 美食
  SHOPPING: 'shopping',        // 购物
  TRANSPORT: 'transport',      // 交通
  ACCOMMODATION: 'accommodation', // 住宿
  ENTERTAINMENT: 'entertainment'  // 娱乐
}

// 活动类型显示名称
export const ACTIVITY_TYPE_LABELS = {
  [ACTIVITY_TYPES.SIGHTSEEING]: '观光游览',
  [ACTIVITY_TYPES.FOOD]: '美食餐饮',
  [ACTIVITY_TYPES.SHOPPING]: '购物消费',
  [ACTIVITY_TYPES.TRANSPORT]: '交通出行',
  [ACTIVITY_TYPES.ACCOMMODATION]: '住宿休息',
  [ACTIVITY_TYPES.ENTERTAINMENT]: '娱乐活动'
}

// 默认行程项目模板
export const DEFAULT_TRIP_ITEM = {
  day_number: 1,
  item_order: 1,
  title: '',
  description: '',
  location: '',
  estimated_cost: 0,
  item_time: '09:00',
  activity_type: ACTIVITY_TYPES.SIGHTSEEING
}

// 默认行程模板
export const DEFAULT_TRIP = {
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  trip_type: TRIP_TYPES.LEISURE,
  items: []
}

// API响应状态码
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'travel_planner_token',
  USER: 'travel_planner_user',
  THEME: 'travel_planner_theme',
  LANGUAGE: 'travel_planner_language'
}

// 表单验证规则
export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 4,
  USERNAME_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 6,
  CAPTCHA_LENGTH: 4,
  TRIP_TITLE_MIN_LENGTH: 1,
  TRIP_TITLE_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500
}

// 路由名称
export const ROUTE_NAMES = {
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',
  TRIPS: 'trips',
  TRIP_DETAIL: 'trip-detail',
  TRIP_EDIT: 'trip-edit',
  PROFILE: 'profile',
  EXPLORE: 'explore',
  ABOUT: 'about'
}