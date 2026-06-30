// src/services/trip.service.js
import api from './api'

export const getTrips = async () => {
  try {
    const response = await api.get('/trips')
    // 直接返回响应，因为响应拦截器已经处理了错误
    return response
  } catch (error) {
    // API调用失败时返回错误信息，不使用mock数据
    console.error('getTrips API failed:', error)
    return { success: false, message: error.message || '获取行程列表失败' }
  }
}

export const getTripById = async (id) => {
  try {
    const response = await api.get(`/trips/${id}`)
    if (response && response.success) return response
    return { success: false, message: '未找到该行程' }
  } catch (error) {
    console.error(`getTripById(${id}) API failed:`, error)
    return { success: false, message: '获取行程失败' }
  }
}

export const createTrip = async (tripData) => {
  try {
    const response = await api.post('/trips', tripData)
    return response
  } catch (error) {
    console.error('createTrip API failed:', error)
    // 不回退到mock数据，直接返回失败
    return { success: false, message: error.message || '创建行程失败' }
  }
}

export const updateTrip = async (id, tripData) => {
  try {
    const response = await api.put(`/trips/${id}`, tripData)
    return response
  } catch (error) {
    console.error('updateTrip API failed:', error)
    // 不回退到mock数据，直接返回失败
    return { success: false, message: error.message || '更新行程失败' }
  }
}

export const deleteTrip = async (id) => {
  try {
    const response = await api.delete(`/trips/${id}`)
    return response
  } catch (error) {
    console.error('deleteTrip API failed:', error)
    return { success: false, message: error.message || '删除行程失败' }
  }
}

// 模拟数据（在没有后端时使用）
export const mockTrips = [
  {
    id: 1,
    title: '五一杭州三日游',
    description: '游览西湖、灵隐寺等著名景点',
    start_date: '2025-05-01',
    end_date: '2025-05-03',
    items: [
      {
        id: 1,
        day_number: 1,
        item_order: 1,
        title: '抵达杭州',
        description: '乘坐高铁抵达杭州东站',
        location: '杭州东站',
        estimated_cost: 200,
        item_time: '09:00',
      },
      {
        id: 2,
        day_number: 1,
        item_order: 2,
        title: '游览西湖',
        description: '漫步苏堤，欣赏西湖美景',
        location: '西湖景区',
        estimated_cost: 100,
        item_time: '14:00',
      },
    ],
  },
  {
    id: 2,
    title: '暑假云南七日游',
    description: '探索大理、丽江、香格里拉',
    start_date: '2025-07-15',
    end_date: '2025-07-21',
    items: [],
  },
  {
    id: 3,
    title: '国庆北京文化之旅',
    description: '故宫、长城、天坛，体验北京深厚历史文化',
    start_date: '2025-10-01',
    end_date: '2025-10-05',
    items: [
      {
        id: 1,
        day_number: 1,
        item_order: 1,
        title: '天安门广场与故宫',
        description: '参观天安门广场，故宫博物院',
        location: '北京市中心',
        estimated_cost: 80,
        item_time: '09:00',
      },
    ],
  },
  {
    id: 4,
    title: '三亚海岛休闲四日游',
    description: '沙滩、潜水与海岛放松时光',
    start_date: '2025-08-12',
    end_date: '2025-08-15',
    items: [
      {
        id: 1,
        day_number: 1,
        item_order: 1,
        title: '亚龙湾海滩',
        description: '海边放松，沙滩活动',
        location: '三亚亚龙湾',
        estimated_cost: 150,
        item_time: '10:00',
      },
    ],
  },
  {
    id: 5,
    title: '青岛海滨周末游',
    description: '海风与啤酒，感受沿海城市魅力',
    start_date: '2025-09-07',
    end_date: '2025-09-08',
    items: [
      {
        id: 1,
        day_number: 1,
        item_order: 1,
        title: '栈桥与八大关漫步',
        description: '沿海栈道散步，品尝海鲜',
        location: '青岛市区',
        estimated_cost: 120,
        item_time: '14:00',
      },
    ],
  },
]
