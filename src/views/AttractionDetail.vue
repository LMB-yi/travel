<!-- src/views/AttractionDetail.vue -->
<template>
  <div class="attraction-detail-container">
    <div class="attraction-detail-header">
      <el-button type="primary" size="large" @click="goBack" :icon="ArrowLeft"> 返回 </el-button>
      <h1 class="page-title">景点详情</h1>
    </div>

    <!-- 加载中状态 -->
    <div class="loading-container" v-if="loading">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 景点内容 -->
    <div class="attraction-detail-content" v-else-if="attraction">
      <div class="attraction-detail-main">
        <!-- 景点图片 -->
        <div class="attraction-detail-image">
          <img :src="attraction.image" :alt="attraction.name" />
        </div>

        <!-- 景点基本信息 -->
        <div class="attraction-detail-info">
          <h2 class="attraction-name">{{ attraction.name }}</h2>
          <div class="attraction-meta">
            <span class="attraction-location">
              <el-icon><Location /></el-icon>
              {{ attraction.location }}
            </span>
            <span class="attraction-region">
              ({{ regionLabels[attraction.region] || attraction.region }})
            </span>
          </div>

          <div class="attraction-rating">
            <el-rate
              v-model="attraction.rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
          </div>

          <div class="attraction-price">
            <el-icon><Coin /></el-icon>
            {{ attraction.price }}
          </div>

          <div class="attraction-tags">
            <el-tag size="large" :type="getSeasonTagType(attraction.season)">
              {{ seasonLabels[attraction.season] || attraction.season }}
            </el-tag>
            <el-tag size="large" type="info">{{ attraction.category }}</el-tag>
          </div>

          <div class="attraction-actions">
            <el-button type="primary" size="large" @click="handleAddToTrip">
              <Plus /> 添加到行程
            </el-button>
          </div>
        </div>
      </div>

      <!-- 景点详细描述 -->
      <div class="attraction-detail-description">
        <h3>景点介绍</h3>
        <p>{{ attraction.description }}</p>
      </div>
    </div>

    <!-- 未找到状态 -->
    <div class="not-found-container" v-else>
      <el-empty description="未找到该景点" :image-size="200">
        <el-button type="primary" @click="goBack">返回</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Location, Coin, Plus } from '@element-plus/icons-vue'
import { useTripStore } from '../stores/trip.store'
import api from '../services/api'

// 设置组件名称
defineOptions({ name: 'AttractionDetailView' })

const route = useRoute()
const router = useRouter()
const tripStore = useTripStore()

const attraction = ref(null)
const loading = ref(true)

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

// 获取景点详情
const fetchAttractionDetail = async () => {
  try {
    loading.value = true
    const id = route.params.id

    // 首先从静态数据中查找
    const staticAttraction = getStaticAttraction(id)
    if (staticAttraction) {
      attraction.value = staticAttraction
      loading.value = false
      return
    }

    // 然后从API获取
    const response = await api.get(`/attractions/${id}`)
    if (response && response.success) {
      attraction.value = {
        ...response.data,
        rating: response.data.rating || 4.5,
        image: response.data.image_url || 'https://picsum.photos/400/300',
        category: response.data.category || '自然风光',
      }
    }
  } catch (error) {
    console.error('获取景点详情失败:', error)
    ElMessage.error('获取景点详情失败')
  } finally {
    loading.value = false
  }
}

// 从静态数据中查找景点
const getStaticAttraction = (id) => {
  // 这里使用与Explore.vue相同的静态数据
  const staticAttractions = [
    {
      id: 1,
      name: '西湖风景区',
      location: '浙江杭州',
      description: '中国著名的风景名胜区，被誉为"人间天堂"',
      category: '自然风光',
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
      region: 'south',
      season: 'all',
      rating: 4.8,
      price: '¥120起',
      image: 'https://picsum.photos/400/300?random=8',
    },
  ]

  return staticAttractions.find((attr) => attr.id === Number(id))
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 添加到行程
const handleAddToTrip = () => {
  // 导航到创建行程页面并传递景点名称作为查询参数
  router.push({ name: 'trip-new', query: { title: attraction.value.name } })
}

onMounted(() => {
  fetchAttractionDetail()
})
</script>

<style scoped>
.attraction-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.attraction-detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.attraction-detail-content {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 30px;
}

.attraction-detail-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.attraction-detail-image {
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.attraction-detail-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.attraction-detail-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.attraction-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.attraction-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: var(--text-secondary);
  font-size: 1rem;
}

.attraction-location {
  display: flex;
  align-items: center;
  gap: 8px;
}

.attraction-location .el-icon {
  color: var(--primary-color);
}

.attraction-region {
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.attraction-rating {
  margin: 10px 0;
}

.attraction-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.attraction-tags {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.attraction-actions {
  margin-top: auto;
}

.attraction-detail-description {
  background: var(--bg-page);
  border-radius: var(--radius-lg);
  padding: 30px;
}

.attraction-detail-description h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 15px;
}

.attraction-detail-description p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-regular);
  margin: 0;
}

.loading-container {
  padding: 40px;
}

.not-found-container {
  text-align: center;
  padding: 40px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .attraction-detail-main {
    grid-template-columns: 1fr;
  }

  .attraction-detail-image img {
    height: 300px;
  }
}
</style>
