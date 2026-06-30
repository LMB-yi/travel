<!-- src/views/HomeView.vue -->
<template>
  <div class="home-container">
    <div class="home-inner">
      <!-- 全屏轮播（Hero） -->
      <section class="hero-section">
        <el-carousel height="calc(100vh - 160px)" :autoplay="true" indicator-position="outside">
          <el-carousel-item v-for="(s, idx) in carouselSlides" :key="idx">
            <div class="hero-slide" :style="{ backgroundImage: `url(${s.image})` }">
              <div class="hero-overlay"></div>
              <div class="hero-content">
                <h2 class="hero-title">{{ s.title }}</h2>
                <p class="hero-desc">{{ s.subtitle }}</p>
                <div class="hero-ctas">
                  <router-link to="/trips/new" class="primary-btn">
                    <el-icon><Plus /></el-icon> 创建新行程
                  </router-link>
                  <router-link to="/explore" class="secondary-btn">
                    <el-icon><View /></el-icon> 浏览景点
                  </router-link>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </section>

      <!-- 热门景点 -->
      <section class="section hot-section">
        <div class="section-head">
          <h3>热门景点</h3>
          <p class="muted">大家都在看的热门目的地</p>
        </div>
        <div class="cards-grid">
          <div v-for="a in hotAttractions" :key="a.id" class="spot-card">
            <div class="spot-thumb" :style="{ backgroundImage: `url(${a.image})` }">
              <el-tag type="danger" class="spot-tag">热门</el-tag>
            </div>
            <div class="spot-body">
              <h4 class="spot-name">{{ a.name }}</h4>
              <p class="spot-location">{{ a.location }}</p>
              <div class="spot-meta">
                <span class="rating">⭐ {{ a.rating }}</span>
                <span class="price">{{ a.price }}</span>
              </div>
              <div class="spot-actions">
                <el-button type="primary" size="small" @click="viewAttraction(a)">查看</el-button>
                <el-button size="small" @click="useTemplate(a)">添加到行程</el-button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 推荐景点 -->
      <section class="section recommend-section">
        <div class="section-head">
          <h3>推荐景点</h3>
          <p class="muted">为您精选的旅行目的地</p>
        </div>
        <el-carousel :interval="4000" arrow="always" height="240px">
          <el-carousel-item v-for="(chunk, i) in recommendedChunks" :key="i">
            <div class="recommend-row">
              <div v-for="a in chunk" :key="a.id" class="recommend-item">
                <img :src="a.image" :alt="a.name" />
                <div class="rec-info">
                  <div class="rec-name">{{ a.name }}</div>
                  <div class="rec-loc">{{ a.location }}</div>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </section>

      <!-- 5A景点 -->
      <section class="section fivea-section">
        <div class="section-head">
          <h3>5A级景区</h3>
          <p class="muted">权威评级的高品质景区推荐</p>
        </div>
        <div class="cards-grid">
          <div v-for="a in fiveAAttractions" :key="a.id" class="spot-card">
            <div class="spot-thumb" :style="{ backgroundImage: `url(${a.image})` }">
              <el-tag type="success" class="spot-tag">5A</el-tag>
            </div>
            <div class="spot-body">
              <h4 class="spot-name">{{ a.name }}</h4>
              <p class="spot-location">{{ a.location }}</p>
              <div class="spot-meta">
                <span class="rating">⭐ {{ a.rating }}</span>
                <span class="price">{{ a.price }}</span>
              </div>
              <div class="spot-actions">
                <el-button type="primary" size="small" @click="viewAttraction(a)">查看</el-button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 统计信息（保留） -->
      <div class="stats-section" v-if="authStore.isAuthenticated">
        <div class="stat-card">
          <el-icon class="stat-icon"><Document /></el-icon>
          <div class="stat-content">
            <div class="stat-number">{{ tripStore.tripCount }}</div>
            <div class="stat-label">总行程数</div>
          </div>
        </div>
        <div class="stat-card">
          <el-icon class="stat-icon"><Calendar /></el-icon>
          <div class="stat-content">
            <div class="stat-number">{{ tripStore.upcomingTrips.length }}</div>
            <div class="stat-label">即将出行</div>
          </div>
        </div>
        <div class="stat-card">
          <el-icon class="stat-icon"><Flag /></el-icon>
          <div class="stat-content">
            <div class="stat-number">{{ totalActivities }}</div>
            <div class="stat-label">活动总数</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useTripStore } from '@/stores/trip.store'
import { Plus, View, Document, Calendar, Flag } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const tripStore = useTripStore()

// mock 数据：轮播与景点
const carouselSlides = ref([
  {
    image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1600&h=900&fit=crop',
    title: '皇家之旅：故宫探秘',
    subtitle: '沉浸在历史与文化的辉煌之中',
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop',
    title: '自然风光：山水之美',
    subtitle: '走进壮丽的自然画卷',
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=900&fit=crop',
    title: '海岛度假：阳光与沙滩',
    subtitle: '放松身心的完美选择',
  },
])

const hotAttractions = ref([
  {
    id: 1,
    name: '故宫博物院',
    location: '北京',
    rating: 4.9,
    price: '¥60起',
    image: 'https://picsum.photos/520/320?random=11',
  },
  {
    id: 2,
    name: '西湖风景区',
    location: '杭州',
    rating: 4.8,
    price: '¥80起',
    image: 'https://picsum.photos/520/320?random=12',
  },
  {
    id: 3,
    name: '张家界国家森林公园',
    location: '张家界',
    rating: 4.8,
    price: '¥248起',
    image: 'https://picsum.photos/520/320?random=13',
  },
  {
    id: 4,
    name: '九寨沟',
    location: '四川',
    rating: 4.9,
    price: '¥220起',
    image: 'https://picsum.photos/520/320?random=14',
  },
])

const recommendedAttractions = ref([
  { id: 21, name: '桂林漓江', location: '桂林', image: 'https://picsum.photos/300/200?random=21' },
  { id: 22, name: '丽江古城', location: '丽江', image: 'https://picsum.photos/300/200?random=22' },
  { id: 23, name: '青岛海滨', location: '青岛', image: 'https://picsum.photos/300/200?random=23' },
  { id: 24, name: '三亚海湾', location: '三亚', image: 'https://picsum.photos/300/200?random=24' },
  { id: 25, name: '苏州园林', location: '苏州', image: 'https://picsum.photos/300/200?random=25' },
  {
    id: 26,
    name: '黄山风景区',
    location: '黄山',
    image: 'https://picsum.photos/300/200?random=26',
  },
])

// 切分为每页显示 3 个
const recommendedChunks = computed(() => {
  const per = 3
  const arr = recommendedAttractions.value
  const chunks = []
  for (let i = 0; i < arr.length; i += per) chunks.push(arr.slice(i, i + per))
  return chunks
})

const fiveAAttractions = ref([
  {
    id: 31,
    name: '长城（八达岭）',
    location: '北京',
    rating: 4.8,
    price: '¥40起',
    image: 'https://picsum.photos/520/320?random=31',
  },
  {
    id: 32,
    name: '西安兵马俑',
    location: '西安',
    rating: 4.9,
    price: '¥120起',
    image: 'https://picsum.photos/520/320?random=32',
  },
  {
    id: 33,
    name: '黄山',
    location: '安徽',
    rating: 4.7,
    price: '¥150起',
    image: 'https://picsum.photos/520/320?random=33',
  },
  {
    id: 34,
    name: '颐和园',
    location: '北京',
    rating: 4.7,
    price: '¥60起',
    image: 'https://picsum.photos/520/320?random=34',
  },
])

const totalActivities = computed(() => {
  if (!tripStore.trips.length) return 0
  return tripStore.trips.reduce((total, trip) => total + (trip.items?.length || 0), 0)
})

const viewAttraction = (a) => {
  // 跳转到景点详情页
  router.push({ name: 'attraction-detail', params: { id: a.id } })
}

const useTemplate = (a) => {
  // 导航到创建行程页面并可预填名称（简单实现）
  router.push({ name: 'trip-new', query: { title: a.name } })
}

onMounted(() => {
  // 如果用户已登录，加载行程数据
  if (authStore.isAuthenticated) tripStore.fetchTrips()
})
</script>

<style scoped>
/* ==== 全屏布局优化 ==== */
.home-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%);
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.home-inner {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

/* 轮播 - 全屏高度 */
.hero-section {
  width: 100%;
  margin-bottom: 40px;
}

:deep(.el-carousel) {
  width: 100%;
  border-radius: 0;
}

.hero-slide {
  width: 100%;
  height: calc(100vh - 160px);
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 0;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.05) 60%);
}

.hero-content {
  position: absolute;
  left: 60px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  z-index: 2;
  max-width: 650px;
  padding: 20px;
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  line-height: 1.2;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
}

.hero-desc {
  font-size: 1.4rem;
  margin: 0 0 30px 0;
  opacity: 0.95;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.6;
}

.hero-ctas {
  display: flex;
  gap: 20px;
}

.hero-ctas .primary-btn,
.hero-ctas .secondary-btn {
  margin: 0;
  padding: 16px 32px;
  font-size: 1.1rem;
}

/* 内容区域 - 充满宽度 */
.section {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto 50px;
  padding: 0 40px;
  box-sizing: border-box;
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 25px;
  width: 100%;
}

.section-head h3 {
  margin: 0;
  font-size: 1.8rem;
  color: #1e293b;
  font-weight: 700;
}

.muted {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
}

/* 卡片网格 - 充分利用空间 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  width: 100%;
}

.spot-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.spot-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.spot-thumb {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
}

.spot-tag {
  position: absolute;
  left: 15px;
  top: 15px;
  font-size: 0.9rem;
  padding: 5px 12px;
}

.spot-body {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.spot-name {
  margin: 0 0 8px 0;
  font-weight: 700;
  font-size: 1.2rem;
  color: #1e293b;
  line-height: 1.3;
}

.spot-location {
  margin: 0 0 15px 0;
  color: #64748b;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.spot-meta {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
  margin-top: auto;
}

.spot-meta .rating {
  color: #f59e0b;
  font-weight: 700;
  font-size: 1.1rem;
}

.spot-meta .price {
  color: #10b981;
  font-weight: 800;
  font-size: 1.3rem;
}

.spot-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.spot-actions .el-button {
  flex: 1;
}

/* 推荐景点 */
.recommend-section {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto 50px;
  padding: 0 40px;
  box-sizing: border-box;
}

:deep(.el-carousel) .recommend-row {
  display: flex;
  gap: 25px;
  align-items: stretch;
  justify-content: center;
  padding: 10px;
  width: 100%;
}

.recommend-item {
  flex: 1;
  min-width: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.recommend-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.recommend-item img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  flex-shrink: 0;
}

.rec-info {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.rec-name {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #1e293b;
  line-height: 1.3;
}

.rec-loc {
  color: #64748b;
  font-size: 0.95rem;
}

/* 统计区域 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin: 50px auto 0;
  max-width: 1400px;
  padding: 0 40px;
  width: 100%;
  box-sizing: border-box;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  display: flex;
  gap: 20px;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 2.8rem;
  color: #6366f1;
}

.stat-number {
  font-size: 2.4rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  color: #64748b;
  font-size: 1rem;
  margin-top: 8px;
}

/* 按钮样式 */
.primary-btn,
.secondary-btn {
  padding: 16px 32px;
  border-radius: 10px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 1.1rem;
  border: none;
  min-width: 180px;
  text-align: center;
}

.primary-btn {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
}

.primary-btn:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.6);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .section,
  .recommend-section,
  .stats-section {
    padding: 0 30px;
    max-width: 100%;
  }

  .hero-content {
    left: 40px;
    max-width: 500px;
  }

  .hero-title {
    font-size: 2.8rem;
  }

  .hero-desc {
    font-size: 1.2rem;
  }
}

@media (max-width: 992px) {
  .hero-slide {
    height: calc(100vh - 120px);
  }

  .hero-content {
    left: 30px;
    max-width: 450px;
  }

  .hero-title {
    font-size: 2.4rem;
  }

  .hero-desc {
    font-size: 1.1rem;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .hero-slide {
    height: calc(100vh - 100px);
  }

  .hero-content {
    left: 20px;
    right: 20px;
    max-width: 100%;
    text-align: center;
    top: 40%;
    transform: translateY(-40%);
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-desc {
    font-size: 1rem;
    margin-bottom: 25px;
  }

  .hero-ctas {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .hero-ctas .primary-btn,
  .hero-ctas .secondary-btn {
    width: 100%;
    max-width: 300px;
  }

  .section,
  .recommend-section,
  .stats-section {
    padding: 0 20px;
  }

  .section-head {
    flex-direction: column;
    gap: 8px;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .spot-thumb {
    height: 180px;
  }
}

@media (max-width: 576px) {
  .hero-slide {
    height: 400px;
  }

  .hero-content {
    top: 30%;
    transform: translateY(-30%);
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .spot-card {
    max-width: 100%;
  }

  :deep(.el-carousel) .recommend-row {
    flex-direction: column;
    gap: 15px;
  }

  .recommend-item {
    width: 100%;
    max-width: 100%;
  }

  .section-head h3 {
    font-size: 1.5rem;
  }

  .muted {
    font-size: 1rem;
  }
}
</style>
