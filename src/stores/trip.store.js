// src/stores/trip.store.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getTrips, 
  getTripById, 
  createTrip, 
  updateTrip, 
  deleteTrip 
} from '@/services/trip.service'

export const useTripStore = defineStore('trip', () => {
  // 状态
  const trips = ref([])
  const currentTrip = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // 计算属性
  const tripCount = computed(() => trips.value.length)
  const upcomingTrips = computed(() => {
    const today = new Date()
    return trips.value.filter(trip => new Date(trip.start_date) >= today)
  })
  const pastTrips = computed(() => {
    const today = new Date()
    return trips.value.filter(trip => new Date(trip.end_date) < today)
  })

  // 动作
  const fetchTrips = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await getTrips()
      if (response.success) {
        trips.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = '获取行程列表失败'
      console.error('Fetch trips error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchTripById = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await getTripById(id)
      if (response.success) {
        currentTrip.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = '获取行程详情失败'
      console.error('Fetch trip error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addTrip = async (tripData) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await createTrip(tripData)
      if (response.success) {
        trips.value.push(response.data)
        return { success: true, data: response.data }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = '创建行程失败'
      console.error('Create trip error:', err)
      return { success: false, message: '创建行程失败' }
    } finally {
      isLoading.value = false
    }
  }

  const editTrip = async (id, tripData) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await updateTrip(id, tripData)
      if (response.success) {
        const index = trips.value.findIndex(trip => trip.id === id)
        if (index !== -1) {
          trips.value[index] = response.data
        }
        if (currentTrip.value && currentTrip.value.id === id) {
          currentTrip.value = response.data
        }
        return { success: true, data: response.data }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = '更新行程失败'
      console.error('Update trip error:', err)
      return { success: false, message: '更新行程失败' }
    } finally {
      isLoading.value = false
    }
  }

  const removeTrip = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await deleteTrip(id)
      if (response.success) {
        trips.value = trips.value.filter(trip => trip.id !== id)
        if (currentTrip.value && currentTrip.value.id === id) {
          currentTrip.value = null
        }
        return { success: true }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = '删除行程失败'
      console.error('Delete trip error:', err)
      return { success: false, message: '删除行程失败' }
    } finally {
      isLoading.value = false
    }
  }

  const clearCurrentTrip = () => {
    currentTrip.value = null
  }

  return {
    // 状态
    trips,
    currentTrip,
    isLoading,
    error,
    
    // 计算属性
    tripCount,
    upcomingTrips,
    pastTrips,
    
    // 动作
    fetchTrips,
    fetchTripById,
    addTrip,
    editTrip,
    removeTrip,
    clearCurrentTrip
  }
})