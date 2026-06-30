<!-- src/views/Explore.vue -->
<template>
  <div class="explore-container">
    <div class="explore-header">
      <h1 class="page-title">景点探索</h1>
      <p class="page-subtitle">发现热门旅游目的地和精彩活动</p>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-card">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索景点、城市、活动..."
          size="large"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>

        <div class="search-filters">
          <el-select v-model="filterCategory" placeholder="分类" clearable>
            <el-option label="自然风光" value="nature" />
            <el-option label="历史古迹" value="historical" />
            <el-option label="城市观光" value="urban" />
            <el-option label="美食体验" value="food" />
            <el-option label="购物中心" value="shopping" />
            <el-option label="户外活动" value="outdoor" />
          </el-select>

          <el-select v-model="filterRegion" placeholder="地区" clearable>
            <el-option label="华北" value="north" />
            <el-option label="华东" value="east" />
            <el-option label="华南" value="south" />
            <el-option label="西南" value="southwest" />
            <el-option label="西北" value="northwest" />
          </el-select>

          <el-select v-model="filterSeason" placeholder="季节" clearable>
            <el-option label="春季" value="spring" />
            <el-option label="夏季" value="summer" />
            <el-option label="秋季" value="autumn" />
            <el-option label="冬季" value="winter" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 热门景点 -->
    <div class="featured-section">
      <h2 class="section-title">
        {{ sectionTitle }}
      </h2>
      <p class="section-subtitle" v-if="showResultsCount">
        找到 {{ filteredAttractions.length }} 个景点
      </p>

      <div class="featured-grid" v-if="filteredAttractions.length > 0">
        <div
          v-for="attraction in paginatedAttractions"
          :key="attraction.id"
          class="featured-card"
          @click="handleAttractionClick(attraction)"
        >
          <div class="featured-image">
            <img :src="attraction.image" :alt="attraction.name" />
            <div class="featured-badge">{{ attraction.category }}</div>
          </div>
          <div class="featured-content">
            <h3>{{ attraction.name }}</h3>
            <p class="attraction-location">
              <el-icon><Location /></el-icon>
              {{ attraction.location }}
              <span class="attraction-region"
                >({{ regionLabels[attraction.region] || attraction.region }})</span
              >
            </p>
            <div class="attraction-tags">
              <el-tag size="small" :type="getSeasonTagType(attraction.season)">
                {{ seasonLabels[attraction.season] || attraction.season }}
              </el-tag>
            </div>
            <p class="attraction-description">{{ attraction.description }}</p>
            <div class="attraction-meta">
              <span class="attraction-rating">
                <el-rate
                  v-model="attraction.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                />
              </span>
              <span class="attraction-price">
                <el-icon><Coin /></el-icon>
                {{ attraction.price }}
              </span>
            </div>
            <div class="attraction-actions">
              <el-button type="primary" size="small" @click.stop="handleViewAttraction(attraction)">
                查看
              </el-button>
              <el-button size="small" @click.stop="handleAddToTrip(attraction)">
                添加到行程
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页组件 -->
      <div class="pagination-container" v-if="filteredAttractions.length > 0">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredAttractions.length"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[4, 8, 12, 16]"
          prev-text="上一页"
          next-text="下一页"
          background
        />
      </div>

      <div class="no-results" v-else>
        <el-empty description="没有找到符合条件的景点" :image-size="200">
          <el-button type="primary" @click="resetFilters">清除筛选条件</el-button>
        </el-empty>
      </div>
    </div>

    <!-- 分类浏览 -->
    <div class="categories-section">
      <h2 class="section-title">分类浏览</h2>

      <div class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          @click="handleCategoryClick(category)"
          :class="{ active: filterCategory === category.categoryId }"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <h3>{{ category.name }}</h3>
          <p>{{ category.count }}个景点</p>
        </div>
      </div>
    </div>

    <!-- 推荐行程 -->
    <div class="recommended-trips-section">
      <h2 class="section-title">推荐行程模板</h2>

      <div class="trips-grid">
        <div v-for="trip in recommendedTrips" :key="trip.id" class="trip-template-card">
          <div class="trip-header">
            <h3>{{ trip.title }}</h3>
            <span class="trip-duration">{{ trip.duration }}天</span>
          </div>

          <div class="trip-description">
            {{ trip.description }}
          </div>

          <div class="trip-destinations">
            <el-tag v-for="dest in trip.destinations" :key="dest" type="info" size="small">
              {{ dest }}
            </el-tag>
          </div>

          <div class="trip-actions">
            <el-button type="primary" size="small" @click="handleUseTemplate(trip)">
              <el-icon><Plus /></el-icon> 使用模板
            </el-button>
            <el-button size="small" @click="handleViewDetails(trip)"> 查看详情 </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- jQuery交互演示 -->
    <div class="jquery-demo-section">
      <h2 class="section-title">交互效果演示</h2>

      <div class="demo-content">
        <div class="demo-controls">
          <button class="demo-btn" id="animateCards">卡片动画</button>
          <button class="demo-btn" id="filterDemo">筛选效果</button>
          <button class="demo-btn" id="searchEffect">搜索效果</button>
          <button class="demo-btn" id="resetAll">重置所有</button>
        </div>

        <div class="demo-area">
          <div class="demo-item" data-category="nature">自然风光</div>
          <div class="demo-item" data-category="historical">历史古迹</div>
          <div class="demo-item" data-category="urban">城市观光</div>
          <div class="demo-item" data-category="food">美食体验</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
// 设置多词组件名以满足 eslint-plugin-vue 规则
defineOptions({ name: 'ExploreView' })
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Location, Coin, Plus } from '@element-plus/icons-vue'
import api from '../services/api' // 导入API服务
import { useTripStore } from '../stores/trip.store' // 导入行程状态管理

const router = useRouter()
const tripStore = useTripStore() // 创建行程状态管理实例

// 响应式数据
const searchKeyword = ref('')
const filterCategory = ref('')
const filterRegion = ref('')
const filterSeason = ref('')
// const dynamicAttractions = ref([]) // 已注释掉，不再使用动态景点数据
// const loading = ref(false) // 已注释掉，不再使用加载状态
// 分页相关数据
const currentPage = ref(1) // 当前页码
const pageSize = ref(8) // 每页显示条数

// 地区标签映射
const regionLabels = {
  north: '华北',
  east: '华东',
  south: '华南',
  southwest: '西南',
  northwest: '西北',
}

// 季节标签映射
const seasonLabels = {
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
  winter: '冬季',
  all: '全年适宜',
}

// 获取季节标签类型
const getSeasonTagType = (season) => {
  const types = {
    spring: 'success',
    summer: 'warning',
    autumn: '',
    winter: 'info',
    all: 'primary',
  }
  return types[season] || ''
}

// 模拟数据 - 为每个景点添加 categoryId、region 和 season 属性
const featuredAttractions = ref([
  {
    id: 1,
    name: '西湖风景区',
    location: '浙江杭州',
    description: '中国著名的风景名胜区，被誉为"人间天堂"',
    category: '自然风光',
    categoryId: 'nature',
    region: 'east',
    season: 'all',
    rating: 4.8,
    price: '¥80起',
    image: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: 2,
    name: '故宫博物院',
    location: '北京',
    description: '世界文化遗产，明清两代的皇家宫殿',
    category: '历史古迹',
    categoryId: 'historical',
    region: 'north',
    season: 'all',
    rating: 4.9,
    price: '¥60起',
    image: 'https://picsum.photos/400/300?random=2',
  },
  {
    id: 3,
    name: '外滩',
    location: '上海',
    description: '上海标志性景观，万国建筑博览群',
    category: '城市观光',
    categoryId: 'urban',
    region: 'east',
    season: 'all',
    rating: 4.7,
    price: '免费',
    image: 'https://picsum.photos/400/300?random=3',
  },
  {
    id: 4,
    name: '张家界国家森林公园',
    location: '湖南张家界',
    description: '世界自然遗产，以奇特的石英砂岩峰林著称',
    category: '自然风光',
    categoryId: 'nature',
    region: 'southwest',
    season: 'spring',
    rating: 4.8,
    price: '¥248起',
    image: 'https://picsum.photos/400/300?random=4',
  },
  {
    id: 5,
    name: '黄山风景区',
    location: '安徽黄山',
    description: '以奇松、怪石、云海和温泉著称的名山',
    category: '自然风光',
    categoryId: 'nature',
    region: 'east',
    season: 'autumn',
    rating: 4.7,
    price: '¥150起',
    image: 'https://picsum.photos/400/300?random=5',
  },
  {
    id: 6,
    name: '长城（八达岭）',
    location: '北京延庆',
    description: '中国古代伟大防御工程，观赏日出云海佳处',
    category: '历史古迹',
    categoryId: 'historical',
    region: 'north',
    season: 'autumn',
    rating: 4.8,
    price: '¥40起',
    image: 'https://picsum.photos/400/300?random=6',
  },
  {
    id: 7,
    name: '九寨沟',
    location: '四川阿坝',
    description: '以彩池、瀑布和原始森林著称的自然保护区',
    category: '自然风光',
    categoryId: 'nature',
    region: 'southwest',
    season: 'autumn',
    rating: 4.9,
    price: '¥220起',
    image: 'https://picsum.photos/400/300?random=7',
  },
  {
    id: 8,
    name: '桂林漓江',
    location: '广西桂林',
    description: '山水甲天下，漓江画舫和竹筏是经典体验',
    category: '自然风光',
    categoryId: 'nature',
    region: 'south',
    season: 'all',
    rating: 4.8,
    price: '¥120起',
    image: 'https://picsum.photos/400/300?random=8',
  },
  {
    id: 9,
    name: '苏州园林（拙政园）',
    location: '江苏苏州',
    description: '典型的江南古典园林艺术代表',
    category: '历史古迹',
    categoryId: 'historical',
    region: 'east',
    season: 'spring',
    rating: 4.6,
    price: '¥70起',
    image: 'https://picsum.photos/400/300?random=9',
  },
  {
    id: 10,
    name: '西安兵马俑',
    location: '陕西西安',
    description: '享誉世界的秦代地下军事阵列陶俑',
    category: '历史古迹',
    categoryId: 'historical',
    region: 'northwest',
    season: 'all',
    rating: 4.9,
    price: '¥120起',
    image: 'https://picsum.photos/400/300?random=10',
  },
  {
    id: 11,
    name: '成都锦里/宽窄巷子',
    location: '四川成都',
    description: '体验川味小吃与传统文化的热门街区',
    category: '美食体验',
    categoryId: 'food',
    region: 'southwest',
    season: 'all',
    rating: 4.5,
    price: '免费',
    image: 'https://picsum.photos/400/300?random=11',
  },
  {
    id: 12,
    name: '青海湖',
    location: '青海',
    description: '高原湖泊，夏季油菜花与湖光山色相映成趣',
    category: '自然风光',
    categoryId: 'nature',
    region: 'northwest',
    season: 'summer',
    rating: 4.7,
    price: '¥90起',
    image: 'https://picsum.photos/400/300?random=12',
  },
  {
    id: 13,
    name: '上海环球金融中心观光厅',
    location: '上海',
    description: '俯瞰上海全景的绝佳观景台',
    category: '城市观光',
    categoryId: 'urban',
    region: 'east',
    season: 'all',
    rating: 4.6,
    price: '¥180起',
    image: 'https://picsum.photos/400/300?random=13',
  },
  {
    id: 14,
    name: '重庆火锅体验店',
    location: '重庆',
    description: '正宗的重庆老火锅，辣味十足',
    category: '美食体验',
    categoryId: 'food',
    region: 'southwest',
    season: 'winter',
    rating: 4.7,
    price: '¥120起',
    image: 'https://picsum.photos/400/300?random=14',
  },
  {
    id: 15,
    name: '北京SKP购物中心',
    location: '北京',
    description: '高端奢侈品购物天堂',
    category: '购物中心',
    categoryId: 'shopping',
    region: 'north',
    season: 'all',
    rating: 4.5,
    price: '¥0起',
    image: 'https://picsum.photos/400/300?random=15',
  },
  {
    id: 16,
    name: '三亚潜水体验',
    location: '海南三亚',
    description: '热带海洋潜水，观赏珊瑚礁和海洋生物',
    category: '户外活动',
    categoryId: 'outdoor',
    region: 'south',
    season: 'winter',
    rating: 4.8,
    price: '¥380起',
    image: 'https://picsum.photos/400/300?random=16',
  },
  {
    id: 17,
    name: '哈尔滨冰雪大世界',
    location: '黑龙江哈尔滨',
    description: '冬季冰雪艺术主题公园',
    category: '城市观光',
    categoryId: 'urban',
    region: 'north',
    season: 'winter',
    rating: 4.7,
    price: '¥300起',
    image: 'https://picsum.photos/400/300?random=17',
  },
  {
    id: 18,
    name: '鼓浪屿',
    location: '福建厦门',
    description: '海上花园，万国建筑博览',
    category: '城市观光',
    categoryId: 'urban',
    region: 'south',
    season: 'spring',
    rating: 4.6,
    price: '¥50起',
    image: 'https://picsum.photos/400/300?random=18',
  },
  {
    id: 19,
    name: '呼伦贝尔大草原',
    location: '内蒙古',
    description: '中国最美草原，体验蒙古族文化',
    category: '户外活动',
    categoryId: 'outdoor',
    region: 'north',
    season: 'summer',
    rating: 4.8,
    price: '¥200起',
    image: 'https://picsum.photos/400/300?random=19',
  },
  {
    id: 20,
    name: '香港迪士尼乐园',
    location: '香港',
    description: '亚洲著名主题乐园',
    category: '购物中心',
    categoryId: 'shopping',
    region: 'south',
    season: 'all',
    rating: 4.7,
    price: '¥600起',
    image: 'https://picsum.photos/400/300?random=20',
  },
])

const categories = ref([
  { id: 1, name: '自然风光', icon: '🏞️', count: 156, categoryId: 'nature' },
  { id: 2, name: '历史古迹', icon: '🏛️', count: 89, categoryId: 'historical' },
  { id: 3, name: '城市观光', icon: '🏙️', count: 123, categoryId: 'urban' },
  { id: 4, name: '美食体验', icon: '🍜', count: 67, categoryId: 'food' },
  { id: 5, name: '购物中心', icon: '🛍️', count: 45, categoryId: 'shopping' },
  { id: 6, name: '户外活动', icon: '🚵', count: 78, categoryId: 'outdoor' },
])

const recommendedTrips = ref([
  {
    id: 1,
    title: '杭州三日经典游',
    duration: 3,
    description: '游览西湖、灵隐寺、宋城等杭州经典景点',
    destinations: ['西湖', '灵隐寺', '宋城', '雷峰塔'],
  },
  {
    id: 2,
    title: '北京五日文化之旅',
    duration: 5,
    description: '深度体验北京的历史文化和现代魅力',
    destinations: ['故宫', '长城', '天坛', '颐和园', '798艺术区'],
  },
  {
    id: 3,
    title: '云南七日自然探险',
    duration: 7,
    description: '探索云南的自然美景和少数民族文化',
    destinations: ['丽江', '大理', '香格里拉', '西双版纳'],
  },
])

// 计算属性
const sectionTitle = computed(() => {
  if (filterCategory.value || filterRegion.value || filterSeason.value || searchKeyword.value) {
    let title = '筛选结果'
    const parts = []

    if (filterCategory.value) {
      const category = categories.value.find((c) => c.categoryId === filterCategory.value)
      if (category) parts.push(category.name)
    }
    if (filterRegion.value) {
      parts.push(regionLabels[filterRegion.value])
    }
    if (filterSeason.value) {
      parts.push(seasonLabels[filterSeason.value])
    }

    if (parts.length > 0) {
      title = `${parts.join(' · ')}`
    }

    return title
  }
  return '热门景点推荐'
})

const showResultsCount = computed(() => {
  return filterCategory.value || filterRegion.value || filterSeason.value || searchKeyword.value
})

const filteredAttractions = computed(() => {
  // 只使用静态景点数据，不合并动态景点
  let attractions = featuredAttractions.value

  // 按分类筛选
  if (filterCategory.value) {
    attractions = attractions.filter((a) => a.categoryId === filterCategory.value)
  }

  // 按地区筛选
  if (filterRegion.value) {
    attractions = attractions.filter((a) => a.region === filterRegion.value)
  }

  // 按季节筛选
  if (filterSeason.value) {
    attractions = attractions.filter((a) => a.season === filterSeason.value || a.season === 'all')
  }

  // 按搜索关键词筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    attractions = attractions.filter(
      (a) =>
        a.name.toLowerCase().includes(keyword) ||
        a.location.toLowerCase().includes(keyword) ||
        a.description.toLowerCase().includes(keyword) ||
        a.category.toLowerCase().includes(keyword),
    )
  }

  return attractions
})

// 分页后的景点数据
const paginatedAttractions = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredAttractions.value.slice(startIndex, endIndex)
})

// 方法
const handleSearch = () => {
  const count = filteredAttractions.value.length
  if (count === 0) {
    ElMessage.warning('没有找到符合条件的景点')
  } else {
    ElMessage.success(`找到 ${count} 个景点`)
  }

  // jQuery效果
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    $('.search-card').animate({ opacity: 0.8 }, 200).animate({ opacity: 1 }, 200)
  }
}

const handleAttractionClick = (attraction) => {
  ElMessage.success(`查看 ${attraction.name} 详情`)

  // jQuery效果：卡片点击动画
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      const card = $(`.featured-card`)
        .filter(function () {
          return $(this).find('h3').text().trim() === attraction.name
        })
        .first()
      card.css('transform', 'scale(0.95)')
      setTimeout(() => {
        card.css('transform', 'scale(1)')
      }, 300)
    } catch (e) {
      console.warn('handleAttractionClick jQuery error:', e)
    }
  }
}

const handleCategoryClick = (category) => {
  // 如果已经是当前分类，则清除筛选
  if (filterCategory.value === category.categoryId) {
    filterCategory.value = ''
    ElMessage.info(`已清除分类筛选`)
  } else {
    filterCategory.value = category.categoryId
    ElMessage.success(`筛选分类: ${category.name}`)
  }

  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      const icon = $(`.category-icon`)
        .filter(function () {
          return $(this).text().trim() === category.icon
        })
        .first()
      icon.animate({ fontSize: '2.5em' }, 200).animate({ fontSize: '2em' }, 200)
    } catch (e) {
      console.warn('handleCategoryClick jQuery error:', e)
    }
  }
}

// 查看景点详情
const handleViewAttraction = (attraction) => {
  router.push({ name: 'attraction-detail', params: { id: attraction.id } })
}

// 添加到行程
const handleAddToTrip = (attraction) => {
  // 导航到创建行程页面并预填名称
  router.push({ name: 'trip-new', query: { title: attraction.name } })
}

const handleUseTemplate = (trip) => {
  ElMessage.success(`使用模板: ${trip.title}`)
  router.push({ name: 'trip-new' })
}

const handleViewDetails = (trip) => {
  ElMessage.info(`查看 ${trip.title} 详情`)
}

const resetFilters = () => {
  filterCategory.value = ''
  filterRegion.value = ''
  filterSeason.value = ''
  searchKeyword.value = ''
  ElMessage.success('已清除所有筛选条件')
}

// jQuery效果
let _exploreTimeouts = []
let _exploreIntervals = []

// 注释掉动态景点数据获取功能，只使用硬代码数据
// const fetchDynamicAttractions = async () => {
//   try {
//     loading.value = true
//     const response = await api.get('/attractions')
//     if (response && response.success) {
//       dynamicAttractions.value = response.data.map((attraction) => ({
//         id: attraction.id,
//         name: attraction.name,
//         location: attraction.region || '未知地区',
//         description: attraction.description || '',
//         category: getCategoryName(attraction.category),
//         categoryId: attraction.category || 'nature',
//         region: attraction.region || 'east',
//         season: 'all',
//         rating: 4.5,
//         price: attraction.price ? `¥${attraction.price}起` : '免费',
//         image: attraction.image_url || `https://picsum.photos/400/300?random=${attraction.id}`,
//       }))
//     }
//   } catch (error) {
//     console.error('获取动态景点失败:', error)
//   } finally {
//     loading.value = false
//   }
// }

onMounted(async () => {
  // 不再调用 fetchDynamicAttractions()，直接使用硬代码数据

  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      // 卡片动画效果
      $('#animateCards').on('click.explore', function () {
        $('.featured-card').each(function (index) {
          $(this)
            .css({ opacity: 0, transform: 'translateY(50px) rotate(5deg)' })
            .delay(index * 200)
            .animate({ opacity: 1, transform: 'translateY(0) rotate(0)' }, 500)
        })
      })

      // 筛选效果演示
      $('#filterDemo').on('click.explore', function () {
        $('.demo-item').show()
        $('.demo-item:not([data-category="nature"])').fadeOut(500)
        const t = setTimeout(() => {
          $('.demo-item').fadeIn(500)
        }, 2000)
        _exploreTimeouts.push(t)
      })

      // 搜索效果
      $('#searchEffect').on('click.explore', function () {
        const searchBox = $('.el-input__inner')
        searchBox
          .focus()
          .val('搜索演示')
          .animate({ backgroundColor: '#f0f9ff' }, 300)
          .animate({ backgroundColor: '' }, 300)

        // 模拟搜索结果
        const t1 = setTimeout(() => {
          $('.featured-card:gt(1)').slideUp(300)
          const t2 = setTimeout(() => {
            $('.featured-card').slideDown(300)
          }, 1500)
          _exploreTimeouts.push(t2)
        }, 800)
        _exploreTimeouts.push(t1)
      })

      // 重置所有效果
      $('#resetAll').on('click.explore', function () {
        resetFilters()
        $('.demo-item').show()
        $('.featured-card').css({ opacity: 1, transform: 'none' })
        $('.category-card').removeClass('active')
        ElMessage.info('所有效果已重置')
      })

      // 景点卡片悬停效果
      $('.featured-card')
        .on('mouseenter.explore', function () {
          $(this).css('transform', 'translateY(-10px) scale(1.02)')
          $(this).find('.featured-image img').css('transform', 'scale(1.1)')
        })
        .on('mouseleave.explore', function () {
          $(this).css('transform', 'translateY(0) scale(1)')
          $(this).find('.featured-image img').css('transform', 'scale(1)')
        })
    } catch (error) {
      console.warn('Explore jQuery效果出错:', error)
    }
  }
})

onBeforeUnmount(() => {
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      $('#animateCards').off('.explore')
      $('#filterDemo').off('.explore')
      $('#searchEffect').off('.explore')
      $('#resetAll').off('.explore')
      $('.featured-card').off('.explore')
      $('.category-card').off('.explore')
      _exploreTimeouts.forEach((id) => clearTimeout(id))
      _exploreIntervals.forEach((id) => clearInterval(id))
      _exploreTimeouts = []
      _exploreIntervals = []
    } catch (error) {
      console.warn('卸载 Explore jQuery 事件时出错:', error)
    }
  }
})
</script>

<style scoped>
.explore-container {
  max-width: 1400px;
  margin: 0 auto;
}

.explore-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 15px;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.search-section {
  margin-bottom: 50px;
}

.search-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-md);
}

.search-filters {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.search-filters .el-select {
  flex: 1;
  min-width: 150px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 15px;
  text-align: center;
}

.section-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 30px;
  font-size: 1rem;
}

.featured-section {
  margin-bottom: 60px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.featured-card {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.featured-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-10px) scale(1.02);
}

.featured-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.featured-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--primary-color);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.featured-content {
  padding: 25px;
}

.featured-content h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
}

/* 分页容器样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 20px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.attraction-location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.attraction-location .el-icon {
  color: var(--primary-color);
}

.attraction-region {
  color: var(--text-tertiary);
  font-size: 0.85rem;
}

.attraction-tags {
  margin-bottom: 10px;
}

.attraction-description {
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.attraction-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.attraction-price {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
}

.attraction-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 15px;
}

.attraction-actions .el-button {
  font-size: 12px;
  padding: 6px 12px;
}

.no-results {
  padding: 60px 20px;
  text-align: center;
  background: var(--bg-page);
  border-radius: var(--radius-lg);
}

.categories-section {
  margin-bottom: 60px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
}

.category-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 2px solid transparent;
}

.category-card:hover,
.category-card.active {
  border-color: var(--primary-color);
  background: var(--primary-light);
  transform: translateY(-5px);
}

.category-icon {
  font-size: 2em;
  margin-bottom: 15px;
}

.category-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.category-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.recommended-trips-section {
  margin-bottom: 60px;
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.trip-template-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 25px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-lighter);
  transition: all var(--transition-fast);
}

.trip-template-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-5px);
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.trip-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.trip-duration {
  background: var(--primary-light);
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.trip-description {
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.trip-destinations {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.trip-actions {
  display: flex;
  gap: 10px;
}

/* jQuery演示区域 */
.jquery-demo-section {
  background: linear-gradient(135deg, var(--bg-page) 0%, #f0f2f5 100%);
  border-radius: var(--radius-lg);
  padding: 40px;
  margin-bottom: 40px;
}

.demo-content {
  max-width: 800px;
  margin: 0 auto;
}

.demo-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.demo-btn {
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.demo-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.demo-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: var(--radius-lg);
  min-height: 200px;
}

.demo-item {
  background: var(--primary-light);
  border: 2px solid var(--primary-color);
  border-radius: var(--radius-md);
  padding: 30px 20px;
  text-align: center;
  font-weight: 600;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .featured-grid,
  .categories-grid,
  .trips-grid {
    grid-template-columns: 1fr;
  }

  .search-filters {
    flex-direction: column;
  }

  .demo-controls {
    flex-direction: column;
  }

  .demo-btn {
    width: 100%;
  }
}
</style>
