<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <span class="logo-icon">✈️</span>
          <span class="logo-text">旅游行程规划系统</span>
        </router-link>

        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/trips" class="nav-link">我的行程</router-link>
          <router-link to="/explore" class="nav-link">景点探索</router-link>
          <router-link to="/about" class="nav-link">关于</router-link>

          <!-- 用户菜单 -->
          <div class="user-menu" v-if="authStore.isAuthenticated">
            <el-dropdown @command="handleCommand">
              <div class="user-info">
                <el-avatar :size="32" :src="userAvatar" class="user-avatar">
                  {{ authStore.user?.username?.charAt(0) || 'U' }}
                </el-avatar>
                <span class="username">{{ authStore.user?.username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <!-- 管理员菜单选项 -->
                  <el-dropdown-item v-if="authStore.user?.is_admin === 1" command="admin">
                    <el-icon><Setting /></el-icon>管理员中心
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div v-else class="auth-buttons">
            <router-link to="/login" class="login-btn">登录</router-link>
            <router-link to="/register" class="register-btn">注册</router-link>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { ArrowDown, User, SwitchButton, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 用户头像（模拟）
const userAvatar = ref('')

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'admin') {
    router.push('/admin')
  } else if (command === 'logout') {
    authStore.logout()
  }
}

// jQuery效果
onMounted(() => {
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      // 导航链接悬停效果
      $('.nav-link')
        .on('mouseenter.header', function () {
          $(this).css('transform', 'translateY(-2px)')
        })
        .on('mouseleave.header', function () {
          $(this).css('transform', 'translateY(0)')
        })

      // Logo悬停效果
      $('.logo')
        .on('mouseenter.header', function () {
          $(this).find('.logo-icon').css('transform', 'rotate(20deg)')
        })
        .on('mouseleave.header', function () {
          $(this).find('.logo-icon').css('transform', 'rotate(0)')
        })
    } catch (error) {
      console.warn('Header jQuery效果出错:', error)
    }
  }
})

onBeforeUnmount(() => {
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      $('.nav-link').off('.header')
      $('.logo').off('.header')
    } catch (error) {
      console.warn('卸载 Header jQuery 事件时出错:', error)
    }
  }
})
</script>

<style scoped>
.app-header {
  background: white;
  box-shadow: var(--shadow-sm);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.logo:hover {
  color: var(--primary-dark);
}

.logo-icon {
  font-size: 1.8rem;
  transition: transform var(--transition-fast);
}

.logo-text {
  font-size: 1.2rem;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--text-regular);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--primary-color);
  background: var(--primary-light);
  text-decoration: none;
  transform: translateY(-2px);
}

.nav-link.router-link-exact-active {
  color: var(--primary-color);
  background: var(--primary-light);
}

.user-menu {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.user-info:hover {
  background: var(--gray-1);
}

.user-avatar {
  background: var(--primary-color);
  color: white;
}

.username {
  font-weight: 500;
  color: var(--text-regular);
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.login-btn {
  color: var(--text-regular);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.login-btn:hover {
  color: var(--primary-color);
  background: var(--primary-light);
}

.register-btn {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  background: var(--primary-color);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.register-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 1rem 0;
    gap: 1rem;
  }

  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .logo-text {
    font-size: 1rem;
  }
}
</style>
