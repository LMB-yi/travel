<!-- src/views/TripList.vue -->
<template>
  <div class="trip-list-container">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h1 class="page-title">我的行程</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreateTrip">
          <el-icon><Plus /></el-icon> 创建新行程
        </el-button>
        <el-button @click="refreshTrips">
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="totalTrips === 0" class="empty-state">
      <div class="empty-icon">🗺️</div>
      <h3>还没有任何行程</h3>
      <p>开始规划您的第一次旅行吧！</p>
      <el-button type="primary" size="large" @click="handleCreateTrip">
        <el-icon><Plus /></el-icon> 创建第一个行程
      </el-button>
    </div>

    <!-- 行程列表（两栏布局：左侧列表，右侧侧边栏） -->
    <div v-else class="trips-section">
      <div class="trips-layout">
        <div class="trips-main">
          <!-- 筛选和排序 -->
          <div class="filters">
            <el-radio-group v-model="filterType" @change="filterTrips">
              <el-radio-button label="all">全部行程</el-radio-button>
              <el-radio-button label="upcoming">即将出行</el-radio-button>
              <el-radio-button label="past">历史行程</el-radio-button>
            </el-radio-group>

            <el-select
              v-model="sortBy"
              placeholder="排序方式"
              @change="sortTrips"
              class="sort-select"
            >
              <el-option label="创建时间（最新）" value="created_desc" />
              <el-option label="创建时间（最早）" value="created_asc" />
              <el-option label="出发时间（最近）" value="start_desc" />
              <el-option label="出发时间（最远）" value="start_asc" />
            </el-select>
          </div>

          <!-- 行程卡片网格 -->
          <div class="trips-grid">
            <TransitionGroup name="list" tag="div" class="transition-container">
              <div v-for="trip in paginatedTrips" :key="trip.id" class="trip-card-wrapper">
                <TripCard
                  :trip="trip"
                  @edit="handleEditTrip(trip)"
                  @delete="handleDeleteTrip(trip)"
                  @view="handleViewTrip(trip)"
                />
              </div>
            </TransitionGroup>
          </div>

          <!-- 分页 -->
          <div class="pagination" v-if="totalPages > 1">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[6, 12, 24]"
              :total="totalTrips"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>

        <aside class="trips-sidebar" aria-label="侧边栏建议">
          <div class="sidebar-card">
            <h3 class="sidebar-title">旅行灵感</h3>
            <ul class="suggest-list">
              <li>周末短途：周边一日游/两日游推荐</li>
              <li>国内长线：经典城市与自然景点组合</li>
              <li>美食之旅：城市街区 + 必吃清单</li>
            </ul>
          </div>

          <div class="sidebar-card">
            <h3 class="sidebar-title">小贴士</h3>
            <ul class="tips-list">
              <li>提前预订：节假日前两周为宜</li>
              <li>行程备份：导出 PDF 或分享给同行</li>
              <li>预算控制：使用费用估算功能</li>
            </ul>
          </div>

          <div class="sidebar-card">
            <h3 class="sidebar-title">推荐模板</h3>
            <el-button type="text" @click="handleCreateTrip">使用空白模板</el-button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useTripStore } from '@/stores/trip.store'
import TripCard from '@/components/trips/TripCard.vue'

const router = useRouter()
const tripStore = useTripStore()

// 硬代码的行程数据 - 用于展示，不需要登录即可查看
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

// 响应式数据
const filterType = ref('all')
const sortBy = ref('created_desc')
const currentPage = ref(1)
const pageSize = ref(6)

// 计算属性 - 使用硬代码数据而不是从store获取
const filteredTrips = computed(() => {
  // 使用硬代码数据
  let trips = hardcodedTrips.value

  // 筛选
  switch (filterType.value) {
    case 'upcoming':
      trips = trips.filter(trip => new Date(trip.start_date) >= new Date())
      break
    case 'past':
      trips = trips.filter(trip => new Date(trip.end_date) < new Date())
      break
    default:
      trips = trips
  }

  // 排序
  return sortTripsArray(trips)
})

const totalTrips = computed(() => filteredTrips.value.length)
const totalPages = computed(() => Math.ceil(totalTrips.value / pageSize.value))
const paginatedTrips = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTrips.value.slice(start, end)
})

// 排序函数
const sortTripsArray = (trips) => {
  return [...trips].sort((a, b) => {
    switch (sortBy.value) {
      case 'created_asc':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'start_desc':
        return new Date(b.start_date) - new Date(a.start_date)
      case 'start_asc':
        return new Date(a.start_date) - new Date(b.start_date)
      default: // created_desc
        return new Date(b.created_at) - new Date(a.created_at)
    }
  })
}

// 筛选行程
const filterTrips = () => {
  currentPage.value = 1
}

// 排序行程
const sortTrips = () => {
  // 排序逻辑已在计算属性中处理
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

// 处理页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // jQuery效果：滚动到顶部
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    $('.trip-list-container').animate({ scrollTop: 0 }, 300)
  }
}

// 创建新行程
const handleCreateTrip = () => {
  router.push({ name: 'trip-new' })
}

// 编辑行程
const handleEditTrip = (trip) => {
  router.push({ name: 'trip-edit', params: { id: trip.id } })
}

// 查看行程详情
const handleViewTrip = (trip) => {
  router.push({ name: 'trip-detail', params: { id: trip.id } })
}

// 删除行程 - 使用硬代码数据的删除逻辑
const handleDeleteTrip = async (trip) => {
  try {
    await ElMessageBox.confirm(`确定要删除行程 "${trip.title}" 吗？此操作不可恢复。`, '确认删除', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 从硬代码数据中删除
    const index = hardcodedTrips.value.findIndex(t => t.id === trip.id)
    if (index !== -1) {
      hardcodedTrips.value.splice(index, 1)
      ElMessage.success('行程删除成功（演示功能）')
    }
  } catch (error) {
    // 用户取消删除
  }
}

// 刷新行程列表 - 演示功能
const refreshTrips = () => {
  ElMessage.success('行程列表已刷新（演示功能）')
}

// 页面加载时不再需要从store获取数据，直接显示硬代码数据
let _triplistTimeouts = []
onMounted(() => {
  // 不调用 tripStore.fetchTrips()，直接使用硬代码数据

  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      // 卡片入场动画
      const t = setTimeout(() => {
        $('.trip-card-wrapper').each(function (index) {
          $(this)
            .css({ opacity: 0, transform: 'translateY(20px)' })
            .delay(index * 100)
            .animate({ opacity: 1, transform: 'translateY(0)' }, 400)
        })
      }, 300)
      _triplistTimeouts.push(t)

      // 悬停效果
      $('.trip-card')
        .on('mouseenter.triplist', function () {
          $(this).css('transform', 'translateY(-5px)')
        })
        .on('mouseleave.triplist', function () {
          $(this).css('transform', 'translateY(0)')
        })
    } catch (error) {
      console.warn('TripList jQuery效果出错:', error)
    }
  }
})

onBeforeUnmount(() => {
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      $('.trip-card').off('.triplist')
      _triplistTimeouts.forEach((id) => clearTimeout(id))
      _triplistTimeouts = []
    } catch (error) {
      console.warn('卸载 TripList jQuery 事件时出错:', error)
    }
  }
})
</script>

<style scoped>
.trip-list-container {
  max-width: 1400px;
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

.header-actions {
  display: flex;
  gap: 10px;
}

.loading-container {
  padding: 40px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
}

.error-alert {
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 30px;
}

.trips-section {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-sm);
}

/* 两栏布局：主内容 + 侧边栏 */
.trips-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 28px;
  align-items: start;
}

.trips-main {
  min-width: 0;
}

.trips-sidebar {
  position: relative;
}

.sidebar-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 18px;
  margin-bottom: 18px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-lighter);
}

.sidebar-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.suggest-list,
.tips-list {
  margin: 0;
  padding: 0 12px;
  list-style: none;
  color: var(--text-secondary);
}

.suggest-list li,
.tips-list li {
  margin-bottom: 8px;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.sort-select {
  width: 180px;
}

.trips-grid {
  display: grid;
  /* 固定为两列展示，保证每行两个卡片；在窄屏下通过媒体查询降为一列 */
  grid-template-columns: repeat(2, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.trip-card-wrapper {
  transition: all var(--transition-normal);
}

/* 列表过渡动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.list-leave-active {
  position: absolute;
}

.transition-container {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(300px, 1fr));
  gap: 25px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: center;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .sort-select {
    width: 100%;
  }

  .trips-grid {
    grid-template-columns: 1fr;
  }

  .transition-container {
    grid-template-columns: 1fr;
  }
  /* 小屏幕时取消两栏，侧边栏移动到底部 */
  .trips-layout {
    grid-template-columns: 1fr;
  }
  .trips-sidebar {
    order: 2;
  }
}
</style>
