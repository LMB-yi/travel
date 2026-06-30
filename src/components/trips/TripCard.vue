<!-- src/components/trips/TripCard.vue -->
<template>
  <div class="trip-card">
    <!-- 行程头部 -->
    <div class="trip-header">
      <div class="trip-dates">
        <span class="date-icon">📅</span>
        <span class="date-range">{{ formatDateRange }}</span>
      </div>
      <el-tag :type="statusType" size="small" class="status-tag">
        {{ statusText }}
      </el-tag>
    </div>

    <!-- 行程标题和描述 -->
    <div class="trip-body">
      <h3 class="trip-title" @click="$emit('view', trip)">{{ trip.title }}</h3>
      <p class="trip-description" v-if="trip.description">{{ trip.description }}</p>
      
      <!-- 行程统计 -->
      <div class="trip-stats">
        <div class="stat-item">
          <el-icon><Calendar /></el-icon>
          <span>{{ tripDuration }}天</span>
        </div>
        <div class="stat-item" v-if="totalCost > 0">
          <el-icon><Coin /></el-icon>
          <span>¥{{ totalCost.toFixed(2) }}</span>
        </div>
        <div class="stat-item">
          <el-icon><Location /></el-icon>
          <span>{{ activityCount }}个活动</span>
        </div>
      </div>
    </div>

    <!-- 行程操作 -->
    <div class="trip-actions">
      <el-button type="primary" size="small" @click="$emit('view', trip)">
        <el-icon><View /></el-icon> 查看
      </el-button>
      <el-button type="info" size="small" @click="$emit('edit', trip)">
        <el-icon><Edit /></el-icon> 编辑
      </el-button>
      <el-button type="danger" size="small" @click="$emit('delete', trip)">
        <el-icon><Delete /></el-icon> 删除
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Calendar, Coin, Location, View, Edit, Delete } from '@element-plus/icons-vue'
import { formatDate, calculateTotalCost } from '@/utils/helpers'

const props = defineProps({
  trip: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'delete'])

// 计算属性
const formatDateRange = computed(() => {
  if (!props.trip.start_date || !props.trip.end_date) return '未设置日期'
  return `${formatDate(props.trip.start_date)} - ${formatDate(props.trip.end_date)}`
})

const tripDuration = computed(() => {
  if (!props.trip.start_date || !props.trip.end_date) return 0
  const start = new Date(props.trip.start_date)
  const end = new Date(props.trip.end_date)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
})

const totalCost = computed(() => {
  return calculateTotalCost(props.trip.items || [])
})

const activityCount = computed(() => {
  // 优先使用后端返回的activity_count，如果不存在则使用items数组长度
  return props.trip.activity_count || props.trip.items?.length || 0
})

const statusText = computed(() => {
  if (!props.trip.start_date) return '计划中'
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(props.trip.start_date)
  const endDate = new Date(props.trip.end_date)
  
  if (today < startDate) return '未开始'
  if (today > endDate) return '已结束'
  return '进行中'
})

const statusType = computed(() => {
  switch (statusText.value) {
    case '未开始': return 'info'
    case '进行中': return 'success'
    case '已结束': return ''
    default: return 'info'
  }
})
</script>

<style scoped>
.trip-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 25px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-lighter);
  transition: all var(--transition-normal);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.trip-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-light);
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.trip-dates {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.date-icon {
  font-size: 1.1rem;
}

.date-range {
  font-weight: 500;
}

.status-tag {
  font-weight: 500;
}

.trip-body {
  flex: 1;
  margin-bottom: 20px;
}

.trip-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.trip-title:hover {
  color: var(--primary-color);
}

.trip-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.trip-stats {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--border-light);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-regular);
  font-size: 0.9rem;
}

.stat-item .el-icon {
  color: var(--primary-color);
  font-size: 1rem;
}

.trip-actions {
  display: flex;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
}

.trip-actions .el-button {
  flex: 1;
}

@media (max-width: 480px) {
  .trip-actions {
    flex-direction: column;
  }
  
  .trip-stats {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>