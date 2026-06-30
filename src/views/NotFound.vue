<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-message">抱歉，您访问的页面不存在或已被移除。</p>

      <div class="error-actions">
        <el-button type="primary" size="large" @click="goHome">
          <el-icon><HomeFilled /></el-icon> 返回首页
        </el-button>
        <el-button size="large" @click="goBack">
          <el-icon><Back /></el-icon> 返回上一页
        </el-button>
      </div>

      <div class="error-suggestions">
        <h3>您可能想要访问：</h3>
        <div class="suggestions-list">
          <router-link to="/" class="suggestion-item">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </router-link>
          <router-link to="/trips" class="suggestion-item">
            <el-icon><Document /></el-icon>
            <span>我的行程</span>
          </router-link>
          <router-link to="/explore" class="suggestion-item">
            <el-icon><Search /></el-icon>
            <span>景点探索</span>
          </router-link>
          <router-link to="/about" class="suggestion-item">
            <el-icon><InfoFilled /></el-icon>
            <span>关于我们</span>
          </router-link>
        </div>
      </div>

      <!-- jQuery动画效果 -->
      <div class="error-animation">
        <div class="animation-container">
          <div class="floating-icon">❓</div>
          <div class="floating-icon">🚫</div>
          <div class="floating-icon">🔍</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { HomeFilled, Back, Document, Search, InfoFilled } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}

// jQuery动画效果
let _notfoundTimers = []
let _notfoundIntervals = []

onMounted(() => {
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      // 错误代码动画
      $('.error-code').css('opacity', 0)
      $('.error-code').animate({ opacity: 1 }, 1000)

      // 浮动图标动画
      $('.floating-icon').each(function (index) {
        const $this = $(this)
        $this.css({
          opacity: 0,
          transform: 'translateY(50px) rotate(180deg)',
        })

        const t = setTimeout(() => {
          $this.animate(
            {
              opacity: 1,
              transform: 'translateY(0) rotate(0)',
            },
            800 + index * 200,
          )

          // 持续浮动效果
          const id = setInterval(
            () => {
              $this
                .animate(
                  {
                    transform: 'translateY(-10px)',
                  },
                  1500,
                )
                .animate(
                  {
                    transform: 'translateY(0)',
                  },
                  1500,
                )
            },
            3000 + index * 1000,
          )
          _notfoundIntervals.push(id)
        }, 500)
        _notfoundTimers.push(t)
      })

      // 按钮悬停效果
      $('.el-button')
        .on('mouseenter.notfound', function () {
          $(this).css('transform', 'scale(1.05)')
        })
        .on('mouseleave.notfound', function () {
          $(this).css('transform', 'scale(1)')
        })

      // 建议链接效果
      $('.suggestion-item')
        .on('mouseenter.notfound', function () {
          $(this).css({ transform: 'translateX(10px)', backgroundColor: 'var(--primary-light)' })
        })
        .on('mouseleave.notfound', function () {
          $(this).css({ transform: 'translateX(0)', backgroundColor: '' })
        })

      // 页面元素依次出现效果
      const elements = ['.error-title', '.error-message', '.error-actions', '.error-suggestions']
      elements.forEach((selector, index) => {
        const t = setTimeout(
          () => {
            $(selector).css('opacity', 0)
            $(selector).animate({ opacity: 1 }, 600)
          },
          300 + index * 300,
        )
        _notfoundTimers.push(t)
      })
    } catch (error) {
      console.warn('NotFound jQuery效果出错:', error)
    }
  }
})

onBeforeUnmount(() => {
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      // 移除命名空间事件
      $('.el-button').off('.notfound')
      $('.suggestion-item').off('.notfound')
      // 清理定时器
      _notfoundTimers.forEach((id) => clearTimeout(id))
      _notfoundIntervals.forEach((id) => clearInterval(id))
      _notfoundTimers = []
      _notfoundIntervals = []
    } catch (error) {
      console.warn('卸载 NotFound jQuery 事件时出错:', error)
    }
  }
})
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  padding: 20px;
}

.not-found-content {
  text-align: center;
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: var(--radius-xl);
  padding: 60px 40px;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 5px 5px 0 var(--primary-light);
  opacity: 0;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
  opacity: 0;
}

.error-message {
  font-size: 1.2rem;
  color: var(--text-regular);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  opacity: 0;
}

.error-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 50px;
  opacity: 0;
}

.error-actions .el-button {
  min-width: 150px;
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: var(--radius-lg);
  transition: transform var(--transition-fast);
}

.error-suggestions {
  opacity: 0;
}

.error-suggestions h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 25px;
}

.suggestions-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
}

.suggestion-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 15px;
  background: var(--bg-page);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--transition-fast);
  border: 2px solid transparent;
}

.suggestion-item:hover {
  border-color: var(--primary-color);
  background: var(--primary-light);
  transform: translateX(10px);
  text-decoration: none;
}

.suggestion-item .el-icon {
  font-size: 1.8rem;
  color: var(--primary-color);
}

.suggestion-item span {
  font-weight: 500;
  font-size: 0.95rem;
}

.error-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.animation-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.floating-icon {
  position: absolute;
  font-size: 60px;
  opacity: 0;
}

.floating-icon:nth-child(1) {
  top: 20%;
  left: 10%;
}

.floating-icon:nth-child(2) {
  top: 60%;
  right: 15%;
}

.floating-icon:nth-child(3) {
  bottom: 30%;
  left: 20%;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }

  .error-title {
    font-size: 2rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .error-actions .el-button {
    width: 100%;
    max-width: 300px;
  }

  .suggestions-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .floating-icon {
    font-size: 40px;
  }
}

@media (max-width: 480px) {
  .not-found-content {
    padding: 40px 20px;
  }

  .suggestions-list {
    grid-template-columns: 1fr;
  }

  .floating-icon {
    display: none;
  }
}
</style>
