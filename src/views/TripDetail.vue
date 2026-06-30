<!-- src/views/TripDetail.vue -->
<template>
  <div class="trip-detail-container">
    <!-- 行程详情 -->
    <div v-if="trip" class="trip-detail">
      <!-- 行程头部 -->
      <div class="trip-header">
        <div class="trip-title-section">
          <h1 class="trip-title">{{ trip.title }}</h1>
          <div class="trip-meta">
            <el-tag :type="statusType" class="status-tag">
              {{ statusText }}
            </el-tag>
            <span class="trip-dates">
              <el-icon><Calendar /></el-icon>
              {{ formatDateRange }}
            </span>
            <span class="trip-duration">
              <el-icon><Clock /></el-icon>
              {{ tripDuration }}天
            </span>
            <span class="trip-type" v-if="trip.trip_type">
              <el-icon><Flag /></el-icon>
              {{ tripTypeLabel }}
            </span>
          </div>
        </div>

        <div class="trip-actions">
          <el-button type="primary" @click="handleEdit">
            <el-icon><Edit /></el-icon> 编辑行程
          </el-button>
          <el-button @click="handleBack">
            <el-icon><Back /></el-icon> 返回列表
          </el-button>
          <el-dropdown @command="handleMoreCommand">
            <el-button>
              <el-icon><More /></el-icon> 更多操作
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="print">
                  <el-icon><Printer /></el-icon> 打印行程
                </el-dropdown-item>
                <el-dropdown-item command="share">
                  <el-icon><Share /></el-icon> 分享行程
                </el-dropdown-item>
                <el-dropdown-item divided command="delete">
                  <el-icon><Delete /></el-icon> 删除行程
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 行程描述 -->
      <div v-if="trip.description" class="trip-description-section">
        <h3 class="section-title">行程描述</h3>
        <div class="description-content">
          {{ trip.description }}
        </div>
      </div>

      <!-- 行程统计 -->
      <div class="trip-stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-number">{{ totalDays }}</div>
              <div class="stat-label">总天数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📍</div>
            <div class="stat-content">
              <div class="stat-number">{{ activityCount }}</div>
              <div class="stat-label">活动总数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <div class="stat-number">¥{{ totalCost.toFixed(2) }}</div>
              <div class="stat-label">预估总花费</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏰</div>
            <div class="stat-content">
              <div class="stat-number">{{ averageCostPerDay.toFixed(2) }}</div>
              <div class="stat-label">日均花费</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 按天行程安排 -->
      <div class="daily-schedule-section">
        <h2 class="section-title">行程安排</h2>

        <div class="days-tabs">
          <el-tabs v-model="activeDay" type="border-card">
            <el-tab-pane
              v-for="day in days"
              :key="day.dayNumber"
              :label="`第${day.dayNumber}天`"
              :name="day.dayNumber.toString()"
            >
              <div class="day-content">
                <!-- 当天的活动列表 -->
                <div class="day-activities">
                  <div v-for="(item, index) in day.items" :key="item.id" class="activity-item">
                    <div class="activity-time">{{ item.item_time || '时间待定' }}</div>
                    <div class="activity-card">
                      <div class="activity-header">
                        <div class="activity-type">
                          <el-tag :type="getActivityTypeColor(item.activity_type)" size="small">
                            {{ getActivityTypeLabel(item.activity_type) }}
                          </el-tag>
                        </div>
                        <h3 class="activity-title">{{ item.title }}</h3>
                      </div>

                      <div class="activity-content">
                        <div class="activity-details">
                          <p v-if="item.description" class="activity-description">
                            {{ item.description }}
                          </p>
                          <div v-if="item.location" class="activity-location">
                            <el-icon><Location /></el-icon>
                            <span>{{ item.location }}</span>
                          </div>
                          <div v-if="item.estimated_cost" class="activity-cost">
                            <el-icon><Coin /></el-icon>
                            <span>¥{{ parseFloat(item.estimated_cost).toFixed(2) }}</span>
                          </div>
                        </div>

                        <div class="activity-order">
                          <span class="order-badge">{{ index + 1 }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 空状态 -->
                  <div v-if="day.items.length === 0" class="empty-day">
                    <el-empty description="这一天还没有安排活动" />
                  </div>
                </div>

                <!-- 当天的统计 -->
                <div class="day-summary">
                  <div class="summary-item">
                    <span class="label">活动数量：</span>
                    <span class="value">{{ day.items.length }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">当日花费：</span>
                    <span class="value">¥{{ getDayCost(day).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 费用明细 -->
      <div class="expense-details-section" v-if="hasCosts">
        <h2 class="section-title">费用明细</h2>
        <div class="expense-table">
          <el-table :data="expenseDetails" style="width: 100%">
            <el-table-column prop="activity_type" label="活动类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getActivityTypeColor(row.activity_type)" size="small">
                  {{ getActivityTypeLabel(row.activity_type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="活动名称" />
            <el-table-column prop="day_number" label="第几天" width="80">
              <template #default="{ row }"> 第{{ row.day_number }}天 </template>
            </el-table-column>
            <el-table-column prop="estimated_cost" label="预估花费" width="120">
              <template #default="{ row }">
                ¥{{ parseFloat(row.estimated_cost || 0).toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 行程地图（占位） -->
      <div class="trip-map-section">
        <h2 class="section-title">行程地图</h2>
        <div class="map-placeholder">
          <div class="map-icon">🗺️</div>
          <p>地图功能开发中...</p>
          <small>这里将显示行程中各活动地点的位置关系</small>
        </div>
      </div>
    </div>

    <!-- 行程不存在 -->
    <div v-else class="not-found">
      <el-empty description="行程不存在或已被删除">
        <el-button type="primary" @click="handleBack">返回行程列表</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Calendar,
  Clock,
  Flag,
  Edit,
  Back,
  More,
  Printer,
  Share,
  Delete,
  Location,
  Coin,
} from '@element-plus/icons-vue'
import { useTripStore } from '@/stores/trip.store'
import { formatDate, calculateTotalCost, groupItemsByDay } from '@/utils/helpers'
import { TRIP_TYPE_LABELS, ACTIVITY_TYPE_LABELS, ACTIVITY_TYPES } from '@/utils/constants'

const route = useRoute()
const router = useRouter()
const tripStore = useTripStore()

// 硬代码的行程数据 - 与TripList.vue保持一致
const hardcodedTrips = ref([
  {
    id: 1,
    title: '杭州西湖三日游',
    description: '游览西湖十景，体验杭州的文化底蕴，品尝地道杭帮菜',
    start_date: '2026-07-15',
    end_date: '2026-07-17',
    trip_type: 'leisure',
    created_at: '2026-06-28 10:30:00',
    status: '未开始',
    items: [
      {
        id: 11,
        day_number: 1,
        item_order: 1,
        title: '西湖游船',
        description: '乘坐游船欣赏西湖全景',
        activity_type: 'sightseeing',
        location: '西湖码头',
        item_time: '09:00',
        estimated_cost: 80
      },
      {
        id: 12,
        day_number: 1,
        item_order: 2,
        title: '雷峰塔',
        description: '登塔远眺西湖美景',
        activity_type: 'sightseeing',
        location: '雷峰塔景区',
        item_time: '11:00',
        estimated_cost: 40
      },
      {
        id: 13,
        day_number: 1,
        item_order: 3,
        title: '楼外楼用餐',
        description: '品尝杭州特色菜品',
        activity_type: 'food',
        location: '楼外楼餐厅',
        item_time: '12:30',
        estimated_cost: 150
      },
      {
        id: 21,
        day_number: 2,
        item_order: 1,
        title: '灵隐寺',
        description: '参观千年古刹，感受佛教文化',
        activity_type: 'sightseeing',
        location: '灵隐寺',
        item_time: '08:00',
        estimated_cost: 45
      },
      {
        id: 22,
        day_number: 2,
        item_order: 2,
        title: '飞来峰',
        description: '观赏石窟造像',
        activity_type: 'sightseeing',
        location: '飞来峰',
        item_time: '10:00',
        estimated_cost: 35
      },
      {
        id: 23,
        day_number: 2,
        item_order: 3,
        title: '宋城千古情演出',
        description: '观看大型实景演出',
        activity_type: 'entertainment',
        location: '宋城景区',
        item_time: '19:00',
        estimated_cost: 280
      },
      {
        id: 31,
        day_number: 3,
        item_order: 1,
        title: '中国丝绸博物馆',
        description: '了解丝绸文化历史',
        activity_type: 'sightseeing',
        location: '丝绸博物馆',
        item_time: '09:00',
        estimated_cost: 0
      },
      {
        id: 32,
        day_number: 3,
        item_order: 2,
        title: '河坊街购物',
        description: '购买杭州特产',
        activity_type: 'shopping',
        location: '河坊街',
        item_time: '14:00',
        estimated_cost: 200
      }
    ]
  },
  {
    id: 2,
    title: '北京故宫长城五日游',
    description: '探索北京的历史文化，体验皇家宫殿的宏伟，登长城感受历史沧桑',
    start_date: '2026-08-01',
    end_date: '2026-08-05',
    trip_type: 'family',
    created_at: '2026-06-20 14:20:00',
    status: '未开始',
    items: [
      {
        id: 41,
        day_number: 1,
        item_order: 1,
        title: '故宫博物院',
        description: '参观明清皇家宫殿',
        activity_type: 'sightseeing',
        location: '故宫',
        item_time: '08:30',
        estimated_cost: 60
      },
      {
        id: 42,
        day_number: 1,
        item_order: 2,
        title: '天安门广场',
        description: '观看升旗仪式',
        activity_type: 'sightseeing',
        location: '天安门广场',
        item_time: '06:00',
        estimated_cost: 0
      },
      {
        id: 51,
        day_number: 2,
        item_order: 1,
        title: '长城（八达岭）',
        description: '登长城看日出',
        activity_type: 'sightseeing',
        location: '八达岭长城',
        item_time: '07:00',
        estimated_cost: 40
      },
      {
        id: 52,
        day_number: 2,
        item_order: 2,
        title: '长城午餐',
        description: '长城脚下品尝农家菜',
        activity_type: 'food',
        location: '八达岭农家乐',
        item_time: '12:00',
        estimated_cost: 80
      },
      {
        id: 61,
        day_number: 3,
        item_order: 1,
        title: '颐和园',
        description: '游览皇家园林',
        activity_type: 'sightseeing',
        location: '颐和园',
        item_time: '09:00',
        estimated_cost: 60
      },
      {
        id: 62,
        day_number: 3,
        item_order: 2,
        title: '圆明园遗址',
        description: '了解历史遗迹',
        activity_type: 'sightseeing',
        location: '圆明园',
        item_time: '14:00',
        estimated_cost: 25
      },
      {
        id: 71,
        day_number: 4,
        item_order: 1,
        title: '天坛公园',
        description: '参观明清祭天建筑群',
        activity_type: 'sightseeing',
        location: '天坛',
        item_time: '08:00',
        estimated_cost: 35
      },
      {
        id: 72,
        day_number: 4,
        item_order: 2,
        title: '王府井购物',
        description: '购买北京特产',
        activity_type: 'shopping',
        location: '王府井大街',
        item_time: '16:00',
        estimated_cost: 300
      },
      {
        id: 81,
        day_number: 5,
        item_order: 1,
        title: '北京胡同游',
        description: '体验老北京文化',
        activity_type: 'sightseeing',
        location: '南锣鼓巷',
        item_time: '09:00',
        estimated_cost: 50
      },
      {
        id: 82,
        day_number: 5,
        item_order: 2,
        title: '烤鸭晚宴',
        description: '品尝正宗北京烤鸭',
        activity_type: 'food',
        location: '全聚德',
        item_time: '18:00',
        estimated_cost: 200
      }
    ]
  },
  {
    id: 3,
    title: '云南大理丽江七日游',
    description: '感受云南的自然风光和少数民族文化，体验古城的魅力',
    start_date: '2026-09-10',
    end_date: '2026-09-16',
    trip_type: 'backpacking',
    created_at: '2026-06-15 16:45:00',
    status: '未开始',
    items: [
      {
        id: 91,
        day_number: 1,
        item_order: 1,
        title: '大理古城',
        description: '漫步古城街道',
        activity_type: 'sightseeing',
        location: '大理古城',
        item_time: '10:00',
        estimated_cost: 0
      },
      {
        id: 92,
        day_number: 1,
        item_order: 2,
        title: '洱海骑行',
        description: '环洱海骑行观景',
        activity_type: 'outdoor',
        location: '洱海环线',
        item_time: '14:00',
        estimated_cost: 50
      },
      {
        id: 101,
        day_number: 2,
        item_order: 1,
        title: '苍山索道',
        description: '乘索道登苍山',
        activity_type: 'sightseeing',
        location: '苍山',
        item_time: '08:00',
        estimated_cost: 120
      },
      {
        id: 102,
        day_number: 2,
        item_order: 2,
        title: '喜洲古镇',
        description: '参观白族民居',
        activity_type: 'sightseeing',
        location: '喜洲',
        item_time: '14:00',
        estimated_cost: 30
      },
      {
        id: 111,
        day_number: 3,
        item_order: 1,
        title: '双廊古镇',
        description: '洱海边的艺术小镇',
        activity_type: 'sightseeing',
        location: '双廊',
        item_time: '09:00',
        estimated_cost: 0
      },
      {
        id: 121,
        day_number: 4,
        item_order: 1,
        title: '丽江古城',
        description: '探索纳西族古城',
        activity_type: 'sightseeing',
        location: '丽江古城',
        item_time: '10:00',
        estimated_cost: 50
      },
      {
        id: 122,
        day_number: 4,
        item_order: 2,
        title: '丽江美食探索',
        description: '品尝纳西族特色菜',
        activity_type: 'food',
        location: '丽江古城',
        item_time: '18:00',
        estimated_cost: 100
      },
      {
        id: 131,
        day_number: 5,
        item_order: 1,
        title: '玉龙雪山',
        description: '登雪山观景',
        activity_type: 'sightseeing',
        location: '玉龙雪山',
        item_time: '07:00',
        estimated_cost: 200
      },
      {
        id: 132,
        day_number: 5,
        item_order: 2,
        title: '蓝月谷',
        description: '雪山脚下的湖泊美景',
        activity_type: 'sightseeing',
        location: '蓝月谷',
        item_time: '14:00',
        estimated_cost: 60
      },
      {
        id: 141,
        day_number: 6,
        item_order: 1,
        title: '束河古镇',
        description: '安静古朴的纳西族古镇',
        activity_type: 'sightseeing',
        location: '束河',
        item_time: '09:00',
        estimated_cost: 30
      },
      {
        id: 142,
        day_number: 6,
        item_order: 2,
        title: '丽江特产购物',
        description: '购买丽江手工艺品',
        activity_type: 'shopping',
        location: '丽江古城',
        item_time: '15:00',
        estimated_cost: 250
      },
      {
        id: 151,
        day_number: 7,
        item_order: 1,
        title: '拉市海',
        description: '高原湖泊湿地观鸟',
        activity_type: 'outdoor',
        location: '拉市海',
        item_time: '08:00',
        estimated_cost: 80
      }
    ]
  },
  {
    id: 4,
    title: '成都美食文化四日游',
    description: '探索成都的美食文化，体验川味火锅，游览熊猫基地',
    start_date: '2026-10-05',
    end_date: '2026-10-08',
    trip_type: 'leisure',
    created_at: '2026-06-10 11:00:00',
    status: '未开始',
    items: [
      {
        id: 161,
        day_number: 1,
        item_order: 1,
        title: '成都熊猫基地',
        description: '参观大熊猫繁育基地',
        activity_type: 'sightseeing',
        location: '熊猫基地',
        item_time: '08:00',
        estimated_cost: 55
      },
      {
        id: 162,
        day_number: 1,
        item_order: 2,
        title: '宽窄巷子',
        description: '体验成都慢生活',
        activity_type: 'sightseeing',
        location: '宽窄巷子',
        item_time: '14:00',
        estimated_cost: 0
      },
      {
        id: 163,
        day_number: 1,
        item_order: 3,
        title: '火锅晚餐',
        description: '品尝正宗成都火锅',
        activity_type: 'food',
        location: '小龙坎火锅',
        item_time: '19:00',
        estimated_cost: 120
      },
      {
        id: 171,
        day_number: 2,
        item_order: 1,
        title: '武侯祠',
        description: '参观三国文化遗址',
        activity_type: 'sightseeing',
        location: '武侯祠',
        item_time: '09:00',
        estimated_cost: 50
      },
      {
        id: 172,
        day_number: 2,
        item_order: 2,
        title: '锦里古街',
        description: '品尝成都小吃',
        activity_type: 'food',
        location: '锦里',
        item_time: '12:00',
        estimated_cost: 80
      },
      {
        id: 181,
        day_number: 3,
        item_order: 1,
        title: '杜甫草堂',
        description: '参观诗圣故居',
        activity_type: 'sightseeing',
        location: '杜甫草堂',
        item_time: '08:30',
        estimated_cost: 50
      },
      {
        id: 182,
        day_number: 3,
        item_order: 2,
        title: '人民公园',
        description: '体验茶馆文化',
        activity_type: 'entertainment',
        location: '人民公园',
        item_time: '14:00',
        estimated_cost: 30
      },
      {
        id: 191,
        day_number: 4,
        item_order: 1,
        title: '春熙路购物',
        description: '购买成都特产',
        activity_type: 'shopping',
        location: '春熙路',
        item_time: '10:00',
        estimated_cost: 200
      },
      {
        id: 192,
        day_number: 4,
        item_order: 2,
        title: '川菜体验',
        description: '学习制作川菜',
        activity_type: 'food',
        location: '川菜体验馆',
        item_time: '15:00',
        estimated_cost: 150
      }
    ]
  },
  {
    id: 5,
    title: '西安古都文化三日游',
    description: '探索千年古都，参观兵马俑，体验西安历史文化',
    start_date: '2026-11-01',
    end_date: '2026-11-03',
    trip_type: 'historical',
    created_at: '2026-06-05 09:30:00',
    status: '未开始',
    items: [
      {
        id: 201,
        day_number: 1,
        item_order: 1,
        title: '兵马俑博物馆',
        description: '参观世界文化遗产',
        activity_type: 'sightseeing',
        location: '兵马俑博物馆',
        item_time: '08:00',
        estimated_cost: 120
      },
      {
        id: 202,
        day_number: 1,
        item_order: 2,
        title: '华清池',
        description: '参观皇家温泉遗址',
        activity_type: 'sightseeing',
        location: '华清池',
        item_time: '14:00',
        estimated_cost: 80
      },
      {
        id: 211,
        day_number: 2,
        item_order: 1,
        title: '西安古城墙',
        description: '骑行古城墙',
        activity_type: 'outdoor',
        location: '古城墙',
        item_time: '07:00',
        estimated_cost: 45
      },
      {
        id: 212,
        day_number: 2,
        item_order: 2,
        title: '大雁塔',
        description: '参观唐代佛塔',
        activity_type: 'sightseeing',
        location: '大雁塔',
        item_time: '09:00',
        estimated_cost: 50
      },
      {
        id: 213,
        day_number: 2,
        item_order: 3,
        title: '回民街美食',
        description: '品尝西安特色小吃',
        activity_type: 'food',
        location: '回民街',
        item_time: '18:00',
        estimated_cost: 100
      },
      {
        id: 221,
        day_number: 3,
        item_order: 1,
        title: '陕西历史博物馆',
        description: '了解陕西历史文化',
        activity_type: 'sightseeing',
        location: '历史博物馆',
        item_time: '08:30',
        estimated_cost: 0
      },
      {
        id: 222,
        day_number: 3,
        item_order: 2,
        title: '钟鼓楼广场',
        description: '西安市中心地标',
        activity_type: 'sightseeing',
        location: '钟鼓楼',
        item_time: '15:00',
        estimated_cost: 30
      }
    ]
  },
  {
    id: 6,
    title: '三亚海滨度假五日游',
    description: '享受热带海滨风光，体验潜水冲浪，放松身心',
    start_date: '2026-12-20',
    end_date: '2026-12-24',
    trip_type: 'honeymoon',
    created_at: '2026-06-01 13:15:00',
    status: '未开始',
    items: [
      {
        id: 231,
        day_number: 1,
        item_order: 1,
        title: '亚龙湾海滩',
        description: '享受阳光沙滩',
        activity_type: 'outdoor',
        location: '亚龙湾',
        item_time: '10:00',
        estimated_cost: 0
      },
      {
        id: 232,
        day_number: 1,
        item_order: 2,
        title: '潜水体验',
        description: '海底珊瑚礁观赏',
        activity_type: 'outdoor',
        location: '亚龙湾潜水中心',
        item_time: '14:00',
        estimated_cost: 380
      },
      {
        id: 241,
        day_number: 2,
        item_order: 1,
        title: '天涯海角',
        description: '参观著名景点',
        activity_type: 'sightseeing',
        location: '天涯海角',
        item_time: '08:00',
        estimated_cost: 85
      },
      {
        id: 242,
        day_number: 2,
        item_order: 2,
        title: '南山寺',
        description: '参观佛教文化景区',
        activity_type: 'sightseeing',
        location: '南山寺',
        item_time: '14:00',
        estimated_cost: 150
      },
      {
        id: 251,
        day_number: 3,
        item_order: 1,
        title: '蜈支洲岛',
        description: '热带海岛风光',
        activity_type: 'sightseeing',
        location: '蜈支洲岛',
        item_time: '08:00',
        estimated_cost: 168
      },
      {
        id: 252,
        day_number: 3,
        item_order: 2,
        title: '海上冲浪',
        description: '体验冲浪运动',
        activity_type: 'outdoor',
        location: '蜈支洲岛',
        item_time: '14:00',
        estimated_cost: 200
      },
      {
        id: 261,
        day_number: 4,
        item_order: 1,
        title: '三亚免税店购物',
        description: '购买免税商品',
        activity_type: 'shopping',
        location: '免税店',
        item_time: '10:00',
        estimated_cost: 500
      },
      {
        id: 262,
        day_number: 4,
        item_order: 2,
        title: '海鲜大餐',
        description: '品尝新鲜海鲜',
        activity_type: 'food',
        location: '第一市场',
        item_time: '18:00',
        estimated_cost: 200
      },
      {
        id: 271,
        day_number: 5,
        item_order: 1,
        title: '大东海海滩',
        description: '最后的海滨时光',
        activity_type: 'outdoor',
        location: '大东海',
        item_time: '09:00',
        estimated_cost: 0
      }
    ]
  }
])

// 定时器/间隔句柄（用于清理）
let _tripDetailTimeouts = []
let _tripDetailIntervals = []

// 响应式数据
const activeDay = ref('1')
const trip = computed(() => {
  // 从硬代码数据中获取当前行程，而不是从tripStore获取
  const tripId = parseInt(route.params.id)
  return hardcodedTrips.value.find(t => t.id === tripId) || null
})

// 计算属性
const formatDateRange = computed(() => {
  if (!trip.value?.start_date || !trip.value?.end_date) return '未设置日期'
  return `${formatDate(trip.value.start_date)} - ${formatDate(trip.value.end_date)}`
})

const tripDuration = computed(() => {
  if (!trip.value?.start_date || !trip.value?.end_date) return 0
  const start = new Date(trip.value.start_date)
  const end = new Date(trip.value.end_date)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
})

const totalDays = computed(() => tripDuration.value)

const activityCount = computed(() => {
  return trip.value?.items?.length || 0
})

const totalCost = computed(() => {
  return calculateTotalCost(trip.value?.items || [])
})

const averageCostPerDay = computed(() => {
  return totalDays.value > 0 ? totalCost.value / totalDays.value : 0
})

const days = computed(() => {
  if (!trip.value?.items) return []
  const grouped = groupItemsByDay(trip.value.items)
  return Object.keys(grouped).map((dayNumber) => ({
    dayNumber: parseInt(dayNumber),
    items: grouped[dayNumber],
  }))
})

const expenseDetails = computed(() => {
  return (trip.value?.items || [])
    .filter((item) => item.estimated_cost > 0)
    .sort((a, b) => a.day_number - b.day_number || a.item_order - b.item_order)
})

const hasCosts = computed(() => expenseDetails.value.length > 0)

const tripTypeLabel = computed(() => {
  return TRIP_TYPE_LABELS[trip.value?.trip_type] || '未分类'
})

const statusText = computed(() => {
  if (!trip.value?.start_date) return '计划中'

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(trip.value.start_date)
  const endDate = new Date(trip.value.end_date)

  if (today < startDate) return '未开始'
  if (today > endDate) return '已结束'
  return '进行中'
})

const statusType = computed(() => {
  switch (statusText.value) {
    case '未开始':
      return 'info'
    case '进行中':
      return 'success'
    case '已结束':
      return ''
    default:
      return 'info'
  }
})

// 方法
const getActivityTypeLabel = (type) => {
  return ACTIVITY_TYPE_LABELS[type] || '其他活动'
}

const getActivityTypeColor = (type) => {
  const colors = {
    [ACTIVITY_TYPES.SIGHTSEEING]: 'primary',
    [ACTIVITY_TYPES.FOOD]: 'warning',
    [ACTIVITY_TYPES.SHOPPING]: 'danger',
    [ACTIVITY_TYPES.TRANSPORT]: 'info',
    [ACTIVITY_TYPES.ACCOMMODATION]: 'success',
    [ACTIVITY_TYPES.ENTERTAINMENT]: '',
  }
  return colors[type] || 'info'
}

const getDayCost = (day) => {
  return day.items.reduce((total, item) => {
    return total + (parseFloat(item.estimated_cost) || 0)
  }, 0)
}

const handleEdit = () => {
  router.push({ name: 'trip-edit', params: { id: trip.value.id } })
}

const handleBack = () => {
  router.push({ name: 'trips' })
}

const handleMoreCommand = (command) => {
  switch (command) {
    case 'print':
      handlePrint()
      break
    case 'share':
      handleShare()
      break
    case 'delete':
      handleDelete()
      break
  }
}

const handlePrint = () => {
  ElMessage.info('打印功能开发中...')
  // jQuery效果：模拟打印
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    $('.trip-detail').css('box-shadow', '0 0 20px rgba(0,0,0,0.1)')
    const t = setTimeout(() => {
      $('.trip-detail').css('box-shadow', '')
    }, 500)
    _tripDetailTimeouts.push(t)
  }
}

const handleShare = () => {
  ElMessage.success('分享链接已复制到剪贴板')
  navigator.clipboard.writeText(window.location.href).then(() => {
    // jQuery效果
    const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
    if ($) {
      $('.trip-actions .el-button')
        .eq(2)
        .animate(
          {
            backgroundColor: '#67c23a',
          },
          200,
        )
        .animate(
          {
            backgroundColor: '',
          },
          200,
        )
    }
  })
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除行程 "${trip.value.title}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    // 从硬代码数据中删除（演示功能）
    const index = hardcodedTrips.value.findIndex(t => t.id === trip.value.id)
    if (index !== -1) {
      hardcodedTrips.value.splice(index, 1)
      ElMessage.success('行程删除成功（演示功能）')
      router.push({ name: 'trips' })
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    // 用户取消删除
  }
}

const clearError = () => {
  tripStore.error = null
}

// 加载行程数据 - 使用硬代码数据，不从store获取
onMounted(() => {
  // 不调用 tripStore.fetchTripById(tripId)，直接使用硬代码数据

  // jQuery效果（使用本地 $，命名空间 .tripdetail，追踪定时器）
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      // 标签页切换效果
      $('.el-tabs__item').on('click.tripdetail', function () {
        $(this).siblings().removeClass('active')
        $(this).addClass('active')
      })

      // 活动卡片悬停效果（mouseenter/leave 命名空间）
      $('.activity-card')
        .on('mouseenter.tripdetail', function () {
          $(this).css('transform', 'translateX(10px)')
        })
        .on('mouseleave.tripdetail', function () {
          $(this).css('transform', 'translateX(0)')
        })

      // 统计卡片计数动画
      $('.stat-number').each(function () {
        const $this = $(this)
        const target = parseFloat($this.text().replace('¥', '')) || parseInt($this.text())
        let current = 0
        const increment = target / 30
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          if ($this.parent().find('.stat-label').text().includes('花费')) {
            $this.text('¥' + current.toFixed(2))
          } else {
            $this.text(Math.floor(current))
          }
        }, 50)
        _tripDetailIntervals.push(timer)
      })
    } catch (error) {
      console.warn('TripDetail jQuery效果出错:', error)
    }
  }
})

// 监听行程变化
watch(trip, (newTrip) => {
  if (newTrip) {
    // 设置默认激活的标签页
    const today = new Date()
    const startDate = new Date(newTrip.start_date)
    if (newTrip.start_date && today >= startDate) {
      const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1
      if (diffDays >= 1 && diffDays <= totalDays.value) {
        activeDay.value = diffDays.toString()
      }
    }
  }
})

// 卸载时清理 jQuery 事件与定时器
onBeforeUnmount(() => {
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      $('.el-tabs__item').off('.tripdetail')
      $('.activity-card').off('.tripdetail')
      $('.stat-number').off('.tripdetail')
      $('.trip-actions .el-button').off('.tripdetail')
    } catch (error) {
      console.warn('卸载 TripDetail jQuery 事件时出错:', error)
    }
  }
  _tripDetailTimeouts.forEach((id) => clearTimeout(id))
  _tripDetailTimeouts = []
  _tripDetailIntervals.forEach((id) => clearInterval(id))
  _tripDetailIntervals = []
})
</script>

<style scoped>
.trip-detail-container {
  max-width: 1400px;
  margin: 0 auto;
}

.loading-container {
  padding: 40px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
}

.error-alert {
  margin-bottom: 20px;
}

.trip-detail {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-sm);
}

/* 行程头部 */
.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  padding-bottom: 25px;
  border-bottom: 2px solid var(--primary-light);
}

.trip-title-section {
  flex: 1;
}

.trip-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 15px;
  line-height: 1.3;
}

.trip-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.status-tag {
  font-weight: 600;
  font-size: 0.9rem;
}

.trip-dates,
.trip-duration,
.trip-type {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-regular);
  font-size: 0.95rem;
}

.trip-dates .el-icon,
.trip-duration .el-icon,
.trip-type .el-icon {
  color: var(--primary-color);
}

.trip-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

/* 行程描述 */
.trip-description-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.description-content {
  background: var(--bg-page);
  border-radius: var(--radius-md);
  padding: 20px;
  line-height: 1.8;
  color: var(--text-regular);
}

/* 行程统计 */
.trip-stats-section {
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
  border: 1px solid var(--border-lighter);
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 5px;
}

/* 按天行程安排 */
.daily-schedule-section {
  margin-bottom: 40px;
}

.days-tabs {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.day-content {
  padding: 20px;
}

.day-activities {
  margin-bottom: 30px;
}

.activity-item {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  position: relative;
}

.activity-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 45px;
  top: 40px;
  bottom: -25px;
  width: 2px;
  background: var(--border-light);
  z-index: 1;
}

.activity-time {
  flex-shrink: 0;
  width: 90px;
  text-align: center;
  font-weight: 600;
  color: var(--primary-color);
  background: var(--primary-light);
  padding: 8px;
  border-radius: var(--radius-sm);
  position: relative;
  z-index: 2;
}

.activity-card {
  flex: 1;
  background: white;
  border-radius: var(--radius-md);
  padding: 20px;
  border: 1px solid var(--border-lighter);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
  position: relative;
  z-index: 2;
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.activity-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.activity-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.activity-details {
  flex: 1;
}

.activity-description {
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 15px;
}

.activity-location,
.activity-cost {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.activity-location .el-icon,
.activity-cost .el-icon {
  color: var(--primary-color);
}

.activity-order {
  flex-shrink: 0;
}

.order-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 1rem;
}

.empty-day {
  text-align: center;
  padding: 40px;
  background: var(--bg-page);
  border-radius: var(--radius-md);
}

.day-summary {
  display: flex;
  justify-content: flex-end;
  gap: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
}

.summary-item {
  text-align: right;
}

.summary-item .label {
  color: var(--text-regular);
  font-size: 0.9rem;
}

.summary-item .value {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.2rem;
  display: block;
  margin-top: 5px;
}

/* 费用明细 */
.expense-details-section {
  margin-bottom: 40px;
}

.expense-table {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

/* 行程地图 */
.trip-map-section {
  margin-bottom: 30px;
}

.map-placeholder {
  background: var(--bg-page);
  border-radius: var(--radius-lg);
  padding: 60px 20px;
  text-align: center;
  border: 2px dashed var(--border-color);
}

.map-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.map-placeholder p {
  font-size: 1.2rem;
  color: var(--text-regular);
  margin-bottom: 10px;
}

.map-placeholder small {
  color: var(--text-secondary);
}

/* 未找到 */
.not-found {
  text-align: center;
  padding: 60px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
}

@media (max-width: 1024px) {
  .trip-header {
    flex-direction: column;
    gap: 20px;
  }

  .trip-actions {
    align-self: flex-start;
  }
}

@media (max-width: 768px) {
  .trip-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .activity-item {
    flex-direction: column;
    gap: 10px;
  }

  .activity-item:not(:last-child)::after {
    left: 15px;
    top: 90px;
    bottom: -10px;
  }

  .activity-time {
    width: auto;
    align-self: flex-start;
  }

  .activity-content {
    flex-direction: column;
  }

  .day-summary {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .trip-actions {
    flex-direction: column;
    width: 100%;
  }

  .trip-actions .el-button {
    width: 100%;
  }
}
</style>
