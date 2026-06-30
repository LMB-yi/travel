<!-- src/views/TripEdit.vue -->
<template>
  <div class="trip-edit-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">{{ isEditing ? '编辑行程' : '创建新行程' }}</h1>
      <div class="header-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="isSaving" @click="handleSave"> 保存行程 </el-button>
      </div>
    </div>

    <div class="trip-form-wrapper">
      <!-- 左侧：基本信息表单 -->
      <div class="trip-info-section">
        <el-form
          ref="tripFormRef"
          :model="tripForm"
          :rules="tripRules"
          label-width="100px"
          class="trip-form"
        >
          <!-- 行程标题 -->
          <el-form-item label="行程标题" prop="title">
            <el-input
              v-model="tripForm.title"
              placeholder="请输入行程标题，如：五一杭州三日游"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>

          <!-- 行程描述 -->
          <el-form-item label="行程描述" prop="description">
            <el-input
              v-model="tripForm.description"
              type="textarea"
              placeholder="简单描述一下您的旅行计划..."
              :rows="3"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <!-- 出行日期 -->
          <el-form-item label="出行日期" required>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled-date="disabledDate"
              @change="handleDateChange"
            />
          </el-form-item>

          <!-- 行程类型 -->
          <el-form-item label="行程类型">
            <el-select v-model="tripForm.trip_type" placeholder="请选择行程类型">
              <el-option label="休闲度假" value="leisure" />
              <el-option label="商务出差" value="business" />
              <el-option label="探险旅行" value="adventure" />
              <el-option label="家庭旅游" value="family" />
              <el-option label="背包客" value="backpacking" />
              <el-option label="蜜月旅行" value="honeymoon" />
            </el-select>
          </el-form-item>
        </el-form>

        <!-- 总计信息 -->
        <div class="summary-card">
          <h3 class="summary-title">行程概览</h3>
          <div class="summary-content">
            <div class="summary-item">
              <span class="label">行程天数：</span>
              <span class="value">{{ totalDays }}天</span>
            </div>
            <div class="summary-item">
              <span class="label">活动项目：</span>
              <span class="value">{{ totalActivities }}个</span>
            </div>
            <div class="summary-item">
              <span class="label">预估花费：</span>
              <span class="value total-cost">¥{{ totalCost.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：行程项目管理 -->
      <div class="trip-items-section">
        <div class="section-header">
          <h2 class="section-title">行程安排</h2>
          <el-button type="primary" size="small" @click="addDay">
            <el-icon><Plus /></el-icon> 添加一天
          </el-button>
        </div>

        <!-- 按天分组显示 -->
        <div class="days-container">
          <div v-for="day in days" :key="day.dayNumber" class="day-section">
            <div class="day-header">
              <h3 class="day-title">第{{ day.dayNumber }}天</h3>
              <el-button
                v-if="days.length > 1"
                type="danger"
                size="small"
                @click="removeDay(day.dayNumber)"
              >
                <el-icon><Delete /></el-icon> 删除这天
              </el-button>
            </div>

            <!-- 当天的活动项目列表 -->
            <div class="day-items">
              <TransitionGroup name="list" tag="div">
                <TripItemEditor
                  v-for="(item, itemIndex) in day.items"
                  :key="item.id"
                  v-model:item="day.items[itemIndex]"
                  :day-number="day.dayNumber"
                  :item-index="itemIndex"
                  @remove="removeItem(day.dayNumber, itemIndex)"
                  @move-up="moveItemUp(day.dayNumber, itemIndex)"
                  @move-down="moveItemDown(day.dayNumber, itemIndex)"
                />
              </TransitionGroup>

              <!-- 添加活动按钮 -->
              <div class="add-item-btn">
                <el-button type="primary" plain @click="addItem(day.dayNumber)">
                  <el-icon><Plus /></el-icon> 添加活动
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 提示信息 -->
        <div class="tips-section">
          <el-alert title="行程规划提示" type="info" show-icon :closable="false">
            <ul class="tips-list">
              <li>合理安排每天的活动数量，避免过度疲劳</li>
              <li>考虑交通时间和景点开放时间</li>
              <li>预留一定的自由活动和休息时间</li>
              <li>注意各景点之间的地理位置，合理安排顺序</li>
            </ul>
          </el-alert>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useTripStore } from '@/stores/trip.store'
import TripItemEditor from '@/components/trips/TripItemEditor.vue'
import { DEFAULT_TRIP_ITEM } from '@/utils/constants'
import { generateId, calculateTotalCost } from '@/utils/helpers'
import { validateTripTitle } from '@/utils/validators'

const route = useRoute()
const router = useRouter()
const tripStore = useTripStore()

// 跟踪本组件创建的定时器与间隔，卸载时清理
let _tripEditTimeouts = []
let _tripEditIntervals = []

// 判断是编辑还是创建
const tripId = route.params.id
const isEditing = computed(() => !!tripId)

// 响应式数据
const tripFormRef = ref()
const dateRange = ref([])
const isSaving = ref(false)

// 行程表单
const tripForm = reactive({
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  trip_type: 'leisure',
  items: [],
})

// 验证规则
const tripRules = {
  title: [
    { required: true, message: '请输入行程标题', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!validateTripTitle(value)) {
          callback(new Error('行程标题必须在1-50个字符之间'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  description: [{ max: 500, message: '描述不能超过500个字符', trigger: 'blur' }],
}

// 计算属性
const totalDays = computed(() => {
  if (!tripForm.start_date || !tripForm.end_date) return 0
  const start = new Date(tripForm.start_date)
  const end = new Date(tripForm.end_date)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
})

const days = computed(() => {
  const daysArray = []
  for (let i = 1; i <= totalDays.value; i++) {
    const dayItems = tripForm.items.filter((item) => item.day_number === i)
    daysArray.push({
      dayNumber: i,
      items: dayItems,
    })
  }
  return daysArray
})

const totalActivities = computed(() => {
  return tripForm.items.length
})

const totalCost = computed(() => {
  return calculateTotalCost(tripForm.items)
})

// 禁用日期（不能选择过去的日期）
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

// 处理日期变化
const handleDateChange = (dates) => {
  if (dates && dates.length === 2) {
    // 转换日期格式为YYYY-MM-DD
    tripForm.start_date = dates[0] instanceof Date ? dates[0].toISOString().split('T')[0] : dates[0].split('T')[0]
    tripForm.end_date = dates[1] instanceof Date ? dates[1].toISOString().split('T')[0] : dates[1].split('T')[0]

    // 日期变化时，重新整理项目到新的天数中
    reorganizeItemsByDays()
  } else {
    tripForm.start_date = ''
    tripForm.end_date = ''
  }
}

// 添加一天
const addDay = () => {
  if (totalDays.value === 0) {
    // 如果没有设置日期，先设置一个默认的日期范围
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    tripForm.start_date = today.toISOString().split('T')[0]
    tripForm.end_date = tomorrow.toISOString().split('T')[0]
    dateRange.value = [tripForm.start_date, tripForm.end_date]
  } else {
    // 增加一天
    const newEndDate = new Date(tripForm.end_date)
    newEndDate.setDate(newEndDate.getDate() + 1)
    tripForm.end_date = newEndDate.toISOString().split('T')[0]
    dateRange.value[1] = tripForm.end_date
  }
}

// 删除一天
const removeDay = (dayNumber) => {
  ElMessageBox.confirm(`确定要删除第${dayNumber}天吗？这一天的所有活动将被删除。`, '确认删除', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 删除这一天的所有项目
      tripForm.items = tripForm.items.filter((item) => item.day_number !== dayNumber)

      // 调整后续日期的项目
      tripForm.items.forEach((item) => {
        if (item.day_number > dayNumber) {
          item.day_number -= 1
        }
      })

      // 减少结束日期
      const newEndDate = new Date(tripForm.end_date)
      newEndDate.setDate(newEndDate.getDate() - 1)
      tripForm.end_date = newEndDate.toISOString().split('T')[0]
      dateRange.value[1] = tripForm.end_date

      ElMessage.success(`第${dayNumber}天已删除`)
    })
    .catch(() => {
      // 用户取消
    })
}

// 添加活动
const addItem = (dayNumber) => {
  const newItem = {
    ...DEFAULT_TRIP_ITEM,
    id: generateId(),
    day_number: dayNumber,
    item_order: tripForm.items.filter((item) => item.day_number === dayNumber).length + 1,
  }
  tripForm.items.push(newItem)

  // jQuery效果：滚动到新添加的项目
  if (typeof window.$ !== 'undefined') {
    setTimeout(() => {
      $('.day-items').last().find('.trip-item-editor').last().get(0)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 100)
  }
}

// 删除活动
const removeItem = (dayNumber, itemIndex) => {
  const dayItems = tripForm.items.filter((item) => item.day_number === dayNumber)
  const itemId = dayItems[itemIndex]?.id

  if (itemId) {
    tripForm.items = tripForm.items.filter((item) => item.id !== itemId)

    // 重新排序当天的项目
    reorganizeDayItems(dayNumber)
  }
}

// 上移活动
const moveItemUp = (dayNumber, itemIndex) => {
  if (itemIndex === 0) return

  const dayItems = tripForm.items.filter((item) => item.day_number === dayNumber)
  const itemId = dayItems[itemIndex]?.id
  const prevItemId = dayItems[itemIndex - 1]?.id

  if (itemId && prevItemId) {
    const itemIndexGlobal = tripForm.items.findIndex((item) => item.id === itemId)
    const prevItemIndexGlobal = (tripForm.items.findIndex((item) => item.id === prevItemId)[
      // 交换顺序
      (tripForm.items[itemIndexGlobal], tripForm.items[prevItemIndexGlobal])
    ] = [tripForm.items[prevItemIndexGlobal], tripForm.items[itemIndexGlobal]])

    // 更新排序号
    reorganizeDayItems(dayNumber)
  }
}

// 下移活动
const moveItemDown = (dayNumber, itemIndex) => {
  const dayItems = tripForm.items.filter((item) => item.day_number === dayNumber)
  if (itemIndex === dayItems.length - 1) return

  const itemId = dayItems[itemIndex]?.id
  const nextItemId = dayItems[itemIndex + 1]?.id

  if (itemId && nextItemId) {
    const itemIndexGlobal = tripForm.items.findIndex((item) => item.id === itemId)
    const nextItemIndexGlobal = (tripForm.items.findIndex((item) => item.id === nextItemId)[
      // 交换顺序
      (tripForm.items[itemIndexGlobal], tripForm.items[nextItemIndexGlobal])
    ] = [tripForm.items[nextItemIndexGlobal], tripForm.items[itemIndexGlobal]])

    // 更新排序号
    reorganizeDayItems(dayNumber)
  }
}

// 重新整理当天的项目排序
const reorganizeDayItems = (dayNumber) => {
  const dayItems = tripForm.items.filter((item) => item.day_number === dayNumber)
  dayItems.forEach((item, index) => {
    const globalIndex = tripForm.items.findIndex((i) => i.id === item.id)
    if (globalIndex !== -1) {
      tripForm.items[globalIndex].item_order = index + 1
    }
  })
}

// 根据天数重新整理项目
const reorganizeItemsByDays = () => {
  if (totalDays.value === 0) return

  // 重新分配项目到新的天数结构中
  const newItems = []
  tripForm.items.forEach((item) => {
    if (item.day_number > totalDays.value) {
      // 如果原来的天数超过新的总天数，分配到最后一天
      item.day_number = totalDays.value
    }
    newItems.push(item)
  })

  tripForm.items = newItems

  // 重新排序
  days.value.forEach((day) => {
    reorganizeDayItems(day.dayNumber)
  })
}

// 加载行程数据（编辑模式）
const loadTripData = async () => {
  if (isEditing.value) {
    await tripStore.fetchTripById(tripId)

    if (tripStore.currentTrip) {
      Object.assign(tripForm, tripStore.currentTrip)

      if (tripForm.start_date && tripForm.end_date) {
        dateRange.value = [tripForm.start_date, tripForm.end_date]
      }

      // 确保items有默认值
      if (!tripForm.items) {
        tripForm.items = []
      }
    }
  }
}

// 保存行程
const handleSave = async () => {
  try {
    // 验证表单
    await tripFormRef.value.validate()

    // 验证日期
    if (!tripForm.start_date || !tripForm.end_date) {
      ElMessage.warning('请选择出行日期')
      return
    }

    if (new Date(tripForm.end_date) < new Date(tripForm.start_date)) {
      ElMessage.warning('结束日期不能早于开始日期')
      return
    }

    isSaving.value = true

    const tripData = {
      ...tripForm,
      items: tripForm.items.map((item) => ({
        ...item,
        estimated_cost: parseFloat(item.estimated_cost) || 0,
      })),
    }

    let result
    if (isEditing.value) {
      result = await tripStore.editTrip(tripId, tripData)
    } else {
      result = await tripStore.addTrip(tripData)
    }

    if (result.success) {
      ElMessage.success(isEditing.value ? '行程更新成功' : '行程创建成功')
      router.push({ name: 'trip-detail', params: { id: result.data.id } })
    } else {
      ElMessage.error(result.message || '保存失败')
    }
  } catch (error) {
    console.error('保存行程失败:', error)
    ElMessage.error('请检查表单填写是否正确')
  } finally {
    isSaving.value = false
  }
}

// 取消编辑
const handleCancel = () => {
  router.back()
}

// jQuery效果
onMounted(() => {
  // 检查是否有来自其他页面的标题查询参数
  if (route.query.title && !isEditing.value) {
    tripForm.title = route.query.title
  }

  loadTripData()

  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      // 表单输入框焦点效果（命名空间 .tripedit）
      $('.el-input__inner, .el-textarea__inner')
        .on('focus.tripedit', function () {
          $(this).parent().css('border-color', 'var(--primary-color)')
        })
        .on('blur.tripedit', function () {
          $(this).parent().css('border-color', '')
        })

      // 日期选择器动画
      $('.el-date-editor')
        .on('focus.tripedit', function () {
          $(this).animate({ boxShadow: '0 0 0 2px rgba(64, 158, 255, 0.2)' }, 200)
        })
        .on('blur.tripedit', function () {
          $(this).animate({ boxShadow: 'none' }, 200)
        })
    } catch (error) {
      console.warn('TripEdit jQuery效果出错:', error)
    }
  }
})

// 卸载时清理
onBeforeUnmount(() => {
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      $('.el-input__inner, .el-textarea__inner').off('.tripedit')
      $('.el-date-editor').off('.tripedit')
    } catch (error) {
      console.warn('卸载 TripEdit jQuery 事件时出错:', error)
    }
  }
  _tripEditTimeouts.forEach((id) => clearTimeout(id))
  _tripEditTimeouts = []
  _tripEditIntervals.forEach((id) => clearInterval(id))
  _tripEditIntervals = []
})
</script>

<style scoped>
.trip-edit-container {
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.trip-form-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
}

.trip-info-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.trip-form {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-sm);
}

.summary-card {
  background: linear-gradient(135deg, var(--primary-light) 0%, #f0f9ff 100%);
  border-radius: var(--radius-lg);
  padding: 25px;
  border: 1px solid var(--primary-light);
}

.summary-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-primary);
  text-align: center;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(64, 158, 255, 0.1);
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item .label {
  color: var(--text-regular);
  font-weight: 500;
}

.summary-item .value {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.1rem;
}

.summary-item .total-cost {
  color: var(--primary-color);
  font-size: 1.3rem;
}

.trip-items-section {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.days-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.day-section {
  background: var(--bg-page);
  border-radius: var(--radius-lg);
  padding: 25px;
  border: 1px solid var(--border-light);
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--primary-light);
}

.day-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.day-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.add-item-btn {
  text-align: center;
  padding: 20px;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.add-item-btn:hover {
  border-color: var(--primary-color);
  background: var(--primary-light);
}

.add-item-btn .el-button {
  width: 100%;
}

.tips-section {
  margin-top: 30px;
}

.tips-list {
  margin: 10px 0 0 20px;
  color: var(--text-regular);
}

.tips-list li {
  margin-bottom: 8px;
  line-height: 1.5;
}

/* 列表过渡动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}

@media (max-width: 1200px) {
  .trip-form-wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .header-actions {
    display: flex;
    gap: 10px;
  }

  .day-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}
</style>
