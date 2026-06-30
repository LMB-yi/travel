<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-info">
          <div class="footer-logo">
            <span class="logo-icon">✈️</span>
            <span class="logo-text">旅游行程规划系统</span>
          </div>
          <p class="footer-description">专业的旅游行程规划平台，助您轻松规划完美旅程</p>
          <div class="social-links">
            <a href="#" class="social-link">微博</a>
            <a href="#" class="social-link">微信</a>
            <a href="#" class="social-link">GitHub</a>
          </div>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h3>产品</h3>
            <a href="#" class="footer-link">行程规划</a>
            <a href="#" class="footer-link">景点推荐</a>
            <a href="#" class="footer-link">费用估算</a>
          </div>
          <div class="link-group">
            <h3>帮助</h3>
            <router-link to="/about" class="footer-link">关于我们</router-link>
            <a href="#" class="footer-link">使用教程</a>
            <a href="#" class="footer-link">常见问题</a>
          </div>
          <div class="link-group">
            <h3>法律</h3>
            <a href="#" class="footer-link">服务条款</a>
            <a href="#" class="footer-link">隐私政策</a>
            <a href="#" class="footer-link">Cookie政策</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2025 旅游行程规划系统</p>
        <p class="tech-stack">技术栈：Vue 3 + Element Plus + Pinia + Vue Router</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  // jQuery效果（安全引用并使用命名空间）
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      // 社交链接悬停效果
      $('.social-link')
        .on('mouseenter.footer', function () {
          $(this).css('color', 'var(--primary-color)').css('transform', 'translateY(-2px)')
        })
        .on('mouseleave.footer', function () {
          $(this).css('color', '').css('transform', '')
        })

      // 页脚链接悬停效果
      $('.footer-link')
        .on('mouseenter.footer', function () {
          $(this).css('padding-left', '5px')
        })
        .on('mouseleave.footer', function () {
          $(this).css('padding-left', '0')
        })
    } catch (error) {
      console.warn('Footer jQuery效果出错:', error)
    }
  }
})

onBeforeUnmount(() => {
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      $('.social-link').off('.footer')
      $('.footer-link').off('.footer')
    } catch (error) {
      console.warn('卸载 Footer jQuery 事件时出错:', error)
    }
  }
})
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  color: rgb(234, 228, 228);
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  margin-bottom: 30px;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo-icon {
  font-size: 2rem;
}

.footer-description {
  opacity: 0.9;
  line-height: 1.6;
  max-width: 300px;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.social-link {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: all var(--transition-fast);
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.1);
}

.social-link:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.link-group h3 {
  font-size: 1.1rem;
  margin-bottom: 15px;
  color: white;
}

.footer-link {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  margin-bottom: 10px;
  transition: all var(--transition-fast);
}

.footer-link:hover {
  color: white;
  padding-left: 5px;
}

.footer-bottom {
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.8;
}

.tech-stack {
  margin-top: 5px;
  font-size: 0.8rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .footer-links {
    grid-template-columns: 1fr;
  }
}
</style>
