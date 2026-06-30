·<!-- src/components/trips/TripItemEditor.vue -->
<template>
  <div class="trip-item-editor">
    <!-- 项目头部 -->
    <div class="item-header">
      <div class="item-order">#{{ itemIndex + 1 }}</div>
      <div class="item-actions">
        <el-button size="small" @click="emit('move-up')" :disabled="itemIndex === 0">
          <el-icon><ArrowUp /></el-icon>
        </el-button>
        <el-button size="small" @click="emit('move-down')" :disabled="itemIndex === lastIndex">
          <el-icon><ArrowDown /></el-icon>
        </el-button>
        <el-button size="small" type="danger" @click="emit('remove')">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 项目内容 -->
    <div class="item-content">
      <!-- 活动标题 -->
      <el-form-item label="活动标题" class="compact-form-item">
        <el-input
          v-model="item.title"
          placeholder="请输入活动标题"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <!-- 活动类型和时间 -->
      <div class="row">
        <el-form-item label="活动类型" class="compact-form-item">
          <el-select v-model="item.activity_type" placeholder="选择活动类型">
            <el-option label="观光游览" value="sightseeing" />
            <el-option label="美食餐饮" value="food" />
            <el-option label="购物消费" value="shopping" />
            <el-option label="交通出行" value="transport" />
            <el-option label="住宿休息" value="accommodation" />
            <el-option label="娱乐活动" value="entertainment" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间" class="compact-form-item">
          <el-time-picker
            v-model="itemTime"
            placeholder="选择时间"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
      </div>

      <!-- 地点 -->
      <el-form-item label="地点" class="compact-form-item">
        <el-input
          v-model="item.location"
          placeholder="请输入地点"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>

      <!-- 描述 -->
      <el-form-item label="描述" class="compact-form-item">
        <el-input
          v-model="item.description"
          type="textarea"
          placeholder="详细描述活动内容..."
          :rows="2"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <!-- 预估花费 -->
      <el-form-item label="预估花费" class="compact-form-item">
        <el-input-number
          v-model="item.estimated_cost"
          :min="0"
          :step="10"
          :precision="2"
          placeholder="0.00"
        >
          <template #prefix>¥</template>
        </el-input-number>
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ArrowUp, ArrowDown, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  dayNumber: {
    type: Number,
    required: true,
  },
  itemIndex: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:item', 'remove', 'move-up', 'move-down'])

// 计算属性
const lastIndex = computed(() => props.totalItems - 1)

// 处理时间选择器
const itemTime = computed({
  get() {
    return props.item.item_time ? props.item.item_time : null
  },
  set(value) {
    emit('update:item', { ...props.item, item_time: value })
  },
})

// 监听item变化
watch(
  () => props.item,
  (newValue) => {
    // 确保activity_type有默认值
    if (!newValue.activity_type) {
      emit('update:item', { ...newValue, activity_type: 'sightseeing' })
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.trip-item-editor {
  background: white;
  border-radius: var(--radius-md);
  padding: 20px;
  border: 1px solid var(--border-lighter);
  transition: all var(--transition-fast);
  position: relative;
}

.trip-item-editor:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-light);
}

.item-order {
  font-weight: 600;
  color: var(--primary-color);
  background: var(--primary-light);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.item-actions {
  display: flex;
  gap: 5px;
}

.item-actions .el-button {
  padding: 5px;
  min-width: 32px;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.compact-form-item {
  margin-bottom: 0;
}

.compact-form-item :deep(.el-form-item__label) {
  padding: 0;
  line-height: 32px;
  font-size: 0.9rem;
  font-weight: 500;
}

.compact-form-item :deep(.el-form-item__content) {
  line-height: 32px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

@media (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>
