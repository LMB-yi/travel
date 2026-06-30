<!-- src/views/UserProfile.vue -->
<template>
  <div class="user-profile-container">
    <div class="profile-header">
      <h1 class="page-title">个人中心</h1>
    </div>

    <div class="profile-content">
      <!-- 个人信息卡片 -->
      <div class="profile-card">
        <div class="profile-header-section">
          <div class="avatar-section">
            <el-avatar :size="120" :src="userAvatar" class="user-avatar">
              {{ userInitials }}
            </el-avatar>
            <div class="avatar-upload">
              <el-button type="primary" size="small" @click="handleAvatarClick">
                <el-icon><Upload /></el-icon> 更换头像
              </el-button>
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleAvatarChange"
              />
            </div>
          </div>

          <div class="user-info">
            <h2 class="username">{{ hardcodedUser.username }}</h2>
            <p class="user-role">普通用户</p>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-number">{{ hardcodedTrips.length }}</span>
                <span class="stat-label">行程数</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ totalActivities }}</span>
                <span class="stat-label">活动数</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ memberDays }}</span>
                <span class="stat-label">注册天数</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 基本信息表单 -->
        <el-form
          ref="profileFormRef"
          :model="profileForm"
          :rules="profileRules"
          label-width="100px"
          class="profile-form"
        >
          <el-form-item label="用户名">
            <el-input :value="hardcodedUser.username" disabled />
          </el-form-item>

          <el-form-item label="注册时间">
            <el-input :value="formatRegisterDate" disabled />
          </el-form-item>

          <el-form-item label="个性签名" prop="bio">
            <el-input
              v-model="profileForm.bio"
              type="textarea"
              placeholder="介绍一下自己..."
              :rows="3"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSaveProfile"> 保存修改 </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 安全设置 -->
      <div class="security-card">
        <h3 class="card-title">安全设置</h3>

        <div class="security-actions">
          <div class="security-item">
            <div class="security-info">
              <h4>修改密码</h4>
              <p>定期修改密码可以提高账户安全性</p>
            </div>
            <el-button type="primary" plain @click="showChangePassword = true">
              修改密码
            </el-button>
          </div>

          <div class="security-item">
            <div class="security-info">
              <h4>登录历史</h4>
              <p>查看最近的登录记录和设备信息</p>
            </div>
            <el-button @click="handleViewLoginHistory"> 查看记录 </el-button>
          </div>

          <div class="security-item">
            <div class="security-info">
              <h4>账户安全</h4>
              <p>管理账户的安全设置和权限</p>
            </div>
            <el-button @click="handleSecuritySettings"> 安全设置 </el-button>
          </div>
        </div>
      </div>

      <!-- 最近行程 -->
      <div class="recent-trips-card" v-if="recentTrips.length > 0">
        <h3 class="card-title">最近行程</h3>
        <div class="trips-list">
          <div v-for="trip in recentTrips" :key="trip.id" class="trip-item">
            <div class="trip-info">
              <h4>{{ trip.title }}</h4>
              <p class="trip-dates">
                {{ formatDate(trip.start_date) }} - {{ formatDate(trip.end_date) }}
              </p>
            </div>
            <el-button size="small" @click="handleViewTrip(trip)"> 查看详情 </el-button>
          </div>
        </div>
        <div class="view-all">
          <router-link to="/trips">查看全部行程 →</router-link>
        </div>
      </div>

      <!-- 系统设置 -->
      <div class="settings-card">
        <h3 class="card-title">系统设置</h3>

        <div class="settings-options">
          <div class="setting-item">
            <span>界面主题</span>
            <el-switch
              v-model="isDarkMode"
              active-text="暗色"
              inactive-text="亮色"
              @change="toggleTheme"
            />
          </div>

          <div class="setting-item">
            <span>消息通知</span>
            <el-switch v-model="notificationsEnabled" />
          </div>

          <div class="setting-item">
            <span>自动保存</span>
            <el-switch v-model="autoSaveEnabled" />
          </div>

          <div class="setting-item">
            <span>语言设置</span>
            <el-select v-model="language" size="small" style="width: 120px">
              <el-option label="简体中文" value="zh-CN" />
              <el-option label="English" value="en" />
            </el-select>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showChangePassword"
      title="修改密码"
      width="400px"
      @close="resetPasswordForm"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="80px"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input v-model="passwordForm.currentPassword" type="password" show-password />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showChangePassword = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword"> 确认修改 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth.store'
import { useTripStore } from '@/stores/trip.store'
import { validatePassword } from '@/utils/validators'
import { formatDate } from '@/utils/helpers'

const router = useRouter()
const authStore = useAuthStore()
const tripStore = useTripStore()

// 硬代码的用户数据 - 用于演示，不需要登录即可查看
const hardcodedUser = ref({
  id: 1,
  username: '旅行达人',
  email: 'traveler@example.com',
  bio: '热爱旅行，探索世界的每一个角落',
  created_at: '2026-01-15 10:00:00',
  is_admin: 0
})

// 硬代码的行程数据 - 用于计算统计数据
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
      { id: 11, day_number: 1, title: '西湖游船', estimated_cost: 80 },
      { id: 12, day_number: 1, title: '雷峰塔', estimated_cost: 40 },
      { id: 13, day_number: 1, title: '楼外楼用餐', estimated_cost: 150 },
      { id: 21, day_number: 2, title: '灵隐寺', estimated_cost: 45 },
      { id: 22, day_number: 2, title: '飞来峰', estimated_cost: 35 },
      { id: 23, day_number: 2, title: '宋城千古情演出', estimated_cost: 280 },
      { id: 31, day_number: 3, title: '中国丝绸博物馆', estimated_cost: 0 },
      { id: 32, day_number: 3, title: '河坊街购物', estimated_cost: 200 }
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
      { id: 41, day_number: 1, title: '故宫博物院', estimated_cost: 60 },
      { id: 42, day_number: 1, title: '天安门广场', estimated_cost: 0 },
      { id: 51, day_number: 2, title: '长城（八达岭）', estimated_cost: 40 },
      { id: 52, day_number: 2, title: '长城午餐', estimated_cost: 80 },
      { id: 61, day_number: 3, title: '颐和园', estimated_cost: 60 },
      { id: 62, day_number: 3, title: '圆明园遗址', estimated_cost: 25 },
      { id: 71, day_number: 4, title: '天坛公园', estimated_cost: 35 },
      { id: 72, day_number: 4, title: '王府井购物', estimated_cost: 300 },
      { id: 81, day_number: 5, title: '北京胡同游', estimated_cost: 50 },
      { id: 82, day_number: 5, title: '烤鸭晚宴', estimated_cost: 200 }
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
      { id: 91, day_number: 1, title: '大理古城', estimated_cost: 0 },
      { id: 92, day_number: 1, title: '洱海骑行', estimated_cost: 50 },
      { id: 101, day_number: 2, title: '苍山索道', estimated_cost: 120 },
      { id: 102, day_number: 2, title: '喜洲古镇', estimated_cost: 30 },
      { id: 111, day_number: 3, title: '双廊古镇', estimated_cost: 0 },
      { id: 121, day_number: 4, title: '丽江古城', estimated_cost: 50 },
      { id: 122, day_number: 4, title: '丽江美食探索', estimated_cost: 100 },
      { id: 131, day_number: 5, title: '玉龙雪山', estimated_cost: 200 },
      { id: 132, day_number: 5, title: '蓝月谷', estimated_cost: 60 },
      { id: 141, day_number: 6, title: '束河古镇', estimated_cost: 30 },
      { id: 142, day_number: 6, title: '丽江特产购物', estimated_cost: 250 },
      { id: 151, day_number: 7, title: '拉市海', estimated_cost: 80 }
    ]
  }
])

// 响应式数据
const profileFormRef = ref()
const passwordFormRef = ref()
const avatarInput = ref()
const showChangePassword = ref(false)

const profileForm = reactive({
  bio: '热爱旅行，探索世界的每一个角落',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isDarkMode = ref(false)
const notificationsEnabled = ref(true)
const autoSaveEnabled = ref(true)
const language = ref('zh-CN')

// 验证规则
const profileRules = {
  bio: [{ max: 200, message: '个性签名不能超过200个字符', trigger: 'blur' }],
}

const passwordRules = {
  currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!validatePassword(value)) {
          callback(new Error('密码至少需要6位'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 计算属性 - 使用硬代码数据
const userAvatar = computed(() => '')
const userInitials = computed(() => {
  const username = hardcodedUser.value?.username || '旅'
  return username.charAt(0).toUpperCase()
})

const formatRegisterDate = computed(() => {
  if (!hardcodedUser.value?.created_at) return '未知'
  return formatDate(hardcodedUser.value.created_at, 'YYYY年MM月DD日')
})

const totalActivities = computed(() => {
  if (!hardcodedTrips.value.length) return 0
  return hardcodedTrips.value.reduce((total, trip) => {
    return total + (trip.items?.length || 0)
  }, 0)
})

const memberDays = computed(() => {
  if (!hardcodedUser.value?.created_at) return 0
  const created = new Date(hardcodedUser.value.created_at)
  const today = new Date()
  return Math.floor((today - created) / (1000 * 60 * 60 * 24))
})

const recentTrips = computed(() => {
  return hardcodedTrips.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3)
})

// 方法
const handleAvatarClick = () => {
  avatarInput.value.click()
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 简单的文件验证
    if (!file.type.startsWith('image/')) {
      ElMessage.error('请选择图片文件')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      ElMessage.error('图片大小不能超过2MB')
      return
    }

    // 创建本地URL预览（演示功能）
    const reader = new FileReader()
    reader.onload = (e) => {
      ElMessage.success('头像更新成功（演示功能）')

      // jQuery效果：头像旋转动画
      if (typeof window.$ !== 'undefined') {
        $('.user-avatar').css('transform', 'rotate(360deg)')
        setTimeout(() => {
          $('.user-avatar').css('transform', 'rotate(0)')
        }, 600)
      }
    }
    reader.readAsDataURL(file)
  }
}

const handleSaveProfile = async () => {
  try {
    await profileFormRef.value.validate()
    // 模拟保存（演示功能）
    hardcodedUser.value.bio = profileForm.bio
    ElMessage.success('个人信息已保存（演示功能）')
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const handleChangePassword = async () => {
  try {
    await passwordFormRef.value.validate()

    // 模拟密码修改（演示功能）
    ElMessage.success('密码修改成功（演示功能）')
    showChangePassword.value = false
    resetPasswordForm()
  } catch (error) {
    console.error('修改密码失败:', error)
  }
}

const resetPasswordForm = () => {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confConfirmPassword = ''
}

const handleViewLoginHistory = () => {
  ElMessage.info('登录历史功能开发中...')
}

const handleSecuritySettings = () => {
  ElMessage.info('安全设置功能开发中...')
}

const handleViewTrip = (trip) => {
  router.push({ name: 'trip-detail', params: { id: trip.id } })
}

const toggleTheme = () => {
  const theme = isDarkMode.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  ElMessage.success(`已切换到${isDarkMode.value ? '暗色' : '亮色'}主题`)
}

// 不再从tripStore获取数据，使用硬代码数据
onMounted(() => {
  // 不调用 tripStore.fetchTrips()，直接使用硬代码数据
})

onBeforeUnmount(() => {
  // 清理工作（如果有的话）
})
</script>

<style scoped>
.user-profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.profile-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
}

.profile-card {
  grid-column: 1 / -1;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 40px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
}

.profile-header-section {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  align-items: flex-start;
}

.avatar-section {
  text-align: center;
}

.user-avatar {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 15px;
  transition: transform 0.6s ease;
}

.avatar-upload {
  margin-top: 10px;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.user-role {
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 25px;
}

.user-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
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

.profile-form {
  max-width: 600px;
}

.security-card,
.recent-trips-card,
.settings-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 25px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--primary-light);
}

.security-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: var(--bg-page);
  border-radius: var(--radius-md);
}

.security-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.security-info p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.trips-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.trip-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: var(--bg-page);
  border-radius: var(--radius-md);
}

.trip-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.trip-dates {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.view-all {
  text-align: center;
  padding-top: 15px;
  border-top: 1px solid var(--border-light);
}

.view-all a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.view-all a:hover {
  text-decoration: underline;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item span {
  color: var(--text-regular);
  font-weight: 500;
}

@media (max-width: 1024px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-header-section {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }

  .user-stats {
    justify-content: center;
  }

  .security-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .profile-card {
    padding: 25px 20px;
  }

  .user-stats {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
