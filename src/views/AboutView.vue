<!-- src/views/AboutView.vue -->
<template>
  <div class="about-container">
    <div class="about-header">
      <h1 class="about-title">关于旅游行程规划系统</h1>
      <p class="about-subtitle">专业的旅行规划工具，让每一次出行都更加完美</p>
    </div>

    <div class="about-content">
      <!-- 项目介绍 -->
      <section class="about-section">
        <h2 class="section-title">项目介绍</h2>
        <div class="section-content">
          <p>
            旅游行程规划系统是一个基于现代Web技术的智能旅行规划平台，旨在帮助用户轻松创建、管理和优化旅行行程。
          </p>
          <p>
            本系统是课程设计项目，展示了Vue.js框架在实际项目中的应用，涵盖了前端开发的各个关键技术点。
          </p>
        </div>
      </section>

      <!-- 技术栈 -->
      <section class="about-section">
        <h2 class="section-title">技术栈</h2>
        <div class="tech-stack">
          <div class="tech-item" v-for="tech in technologies" :key="tech.name">
            <div class="tech-icon">{{ tech.icon }}</div>
            <div class="tech-info">
              <h3>{{ tech.name }}</h3>
              <p>{{ tech.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 功能特点 -->
      <section class="about-section">
        <h2 class="section-title">功能特点</h2>
        <div class="features-list">
          <div class="feature-item" v-for="feature in features" :key="feature.title">
            <el-icon class="feature-icon" :size="24"><component :is="feature.icon" /></el-icon>
            <div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 开发团队 -->
      <section class="about-section">
        <h2 class="section-title">开发团队</h2>
        <div class="team-members">
          <div class="team-member" v-for="member in teamMembers" :key="member.name">
            <div class="member-avatar">{{ member.avatar }}</div>
            <h3>{{ member.name }}</h3>
            <p class="member-role">{{ member.role }}</p>
            <p class="member-desc">{{ member.description }}</p>
          </div>
        </div>
      </section>

      <!-- jQuery演示区域 -->
      <section class="about-section jquery-demo">
        <h2 class="section-title">jQuery效果演示</h2>
        <div class="demo-content">
          <div class="demo-box">
            <h3>基础效果演示</h3>
            <div class="demo-buttons">
              <button class="jq-btn" id="fadeBtn">淡入淡出</button>
              <button class="jq-btn" id="slideBtn">滑动效果</button>
              <button class="jq-btn" id="animateBtn">动画效果</button>
              <button class="jq-btn" id="profileSlideBtn">个人信息滑动</button>
              <button class="jq-btn" id="cardRotateBtn">卡片旋转效果</button>
            </div>
            <div class="demo-target" id="demoTarget">
              <p>这是一个jQuery效果演示区域</p>
              <p>点击上面的按钮查看不同效果</p>
              <div
                class="profile-demo"
                id="profileDemo"
                style="
                  margin-top: 20px;
                  padding: 15px;
                  background: #f0f9ff;
                  border-radius: 8px;
                  display: none;
                "
              >
                <h4>个人信息演示</h4>
                <p>这是一个个人信息滑动的演示效果</p>
                <p>用于展示jQuery的滑动功能</p>
              </div>
              <div
                class="card-demo"
                id="cardDemo"
                style="
                  margin-top: 20px;
                  padding: 15px;
                  background: #fdf6ec;
                  border-radius: 8px;
                  border: 2px solid #e6a23c;
                  display: none;
                "
              >
                <h4>卡片旋转演示</h4>
                <p>这是一个卡片旋转的演示效果</p>
                <p>用于展示jQuery的动画功能</p>
              </div>
            </div>

            <div
              class="demo-results"
              id="demoResults"
              style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px"
            >
              <h4>效果状态</h4>
              <div class="results-grid">
                <div class="result-item">
                  <span>淡入淡出：</span>
                  <span id="fadeStatus">未激活</span>
                </div>
                <div class="result-item">
                  <span>滑动效果：</span>
                  <span id="slideStatus">未激活</span>
                </div>
                <div class="result-item">
                  <span>动画效果：</span>
                  <span id="animateStatus">未激活</span>
                </div>
                <div class="result-item">
                  <span>个人信息滑动：</span>
                  <span id="profileStatus">未激活</span>
                </div>
                <div class="result-item">
                  <span>卡片旋转：</span>
                  <span id="cardStatus">未激活</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Check, Lock, User, Setting, Star, Share } from '@element-plus/icons-vue'

// 技术栈数据
const technologies = ref([
  { icon: '⚡', name: 'Vue 3', description: '渐进式JavaScript框架' },
  { icon: '🎨', name: 'Element Plus', description: '基于Vue 3的组件库' },
  { icon: '📦', name: 'Pinia', description: 'Vue状态管理库' },
  { icon: '🛣️', name: 'Vue Router', description: 'Vue官方路由' },
  { icon: '🔗', name: 'jQuery', description: 'DOM操作和动画库' },
  { icon: '🎯', name: 'Axios', description: 'HTTP客户端' },
  { icon: '💾', name: 'MySQL', description: '关系型数据库' },
])

// 功能特点
const features = ref([
  { icon: Check, title: '用户认证系统', description: '安全的注册登录机制，保护用户数据' },
  { icon: Lock, title: '行程管理', description: '创建、编辑、删除和查看旅行行程' },
  { icon: User, title: '个性化推荐', description: '基于用户偏好推荐景点和活动' },
  { icon: Setting, title: '智能规划', description: '自动优化行程安排和时间分配' },
  { icon: Star, title: '费用估算', description: '实时计算旅行预算和花费' },
  { icon: Share, title: '分享功能', description: '轻松分享行程给朋友和家人' },
])

// 团队成员
const teamMembers = ref([
  { avatar: '👨‍💻', name: '张三', role: '前端开发工程师', description: '负责Vue组件开发和UI设计' },
  { avatar: '👩‍💻', name: '李四', role: '后端开发工程师', description: '负责API接口和数据库设计' },
  { avatar: '👨‍🎨', name: '王五', role: 'UI设计师', description: '负责用户体验和界面设计' },
  { avatar: '👩‍🔧', name: '赵六', role: '测试工程师', description: '负责功能测试和质量保证' },
])

// jQuery演示
onMounted(() => {
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      console.log('jQuery演示已加载，版本:', $.fn.jquery)

      // 更新状态显示函数
      const updateStatus = (elementId, status, color = '#333') => {
        $(`#${elementId}`).text(status).css('color', color).css('font-weight', 'bold')
      }

      // 重置其他状态函数
      const resetOtherStatuses = (currentId) => {
        const statusIds = [
          'fadeStatus',
          'slideStatus',
          'animateStatus',
          'profileStatus',
          'cardStatus',
        ]
        statusIds.forEach((id) => {
          if (id !== currentId) {
            updateStatus(id, '未激活', '#666')
          }
        })
      }

      // 淡入淡出效果
      $('#fadeBtn').on('click.about', function () {
        const target = $('#demoTarget')
        resetOtherStatuses('fadeStatus')

        target
          .fadeOut(500, () => {
            updateStatus('fadeStatus', '淡出中...', '#e6a23c')
          })
          .fadeIn(500, () => {
            updateStatus('fadeStatus', '已完成', '#67c23a')

            // 隐藏其他演示内容
            $('#profileDemo').hide()
            $('#cardDemo').hide()
          })

        $(this).addClass('active').siblings().removeClass('active')
      })

      // 滑动效果
      $('#slideBtn').on('click.about', function () {
        const target = $('#demoTarget')
        resetOtherStatuses('slideStatus')

        target
          .slideUp(300, () => {
            updateStatus('slideStatus', '向上滑动...', '#e6a23c')
          })
          .slideDown(300, () => {
            updateStatus('slideStatus', '已完成', '#67c23a')

            // 隐藏其他演示内容
            $('#profileDemo').hide()
            $('#cardDemo').hide()
          })

        $(this).addClass('active').siblings().removeClass('active')
      })

      // 动画效果
      $('#animateBtn').on('click.about', function () {
        const target = $('#demoTarget')
        resetOtherStatuses('animateStatus')

        target
          .animate(
            {
              opacity: 0.5,
              marginLeft: '50px',
              backgroundColor: '#f0f9ff',
            },
            300,
            () => {
              updateStatus('animateStatus', '动画中...', '#e6a23c')
            },
          )
          .animate(
            {
              opacity: 1,
              marginLeft: '0',
              backgroundColor: '#ffffff',
            },
            300,
            () => {
              updateStatus('animateStatus', '已完成', '#67c23a')

              // 隐藏其他演示内容
              $('#profileDemo').hide()
              $('#cardDemo').hide()
            },
          )

        $(this).addClass('active').siblings().removeClass('active')
      })

      // 个人信息滑动效果
      $('#profileSlideBtn').on('click.about', function () {
        resetOtherStatuses('profileStatus')

        const profileDemo = $('#profileDemo')
        if (profileDemo.is(':visible')) {
          profileDemo.slideUp(300, () => {
            updateStatus('profileStatus', '已隐藏', '#909399')
          })
        } else {
          // 先隐藏卡片旋转演示
          $('#cardDemo').hide()
          updateStatus('cardStatus', '未激活', '#666')

          profileDemo.slideDown(300, () => {
            updateStatus('profileStatus', '已显示', '#67c23a')
          })
        }

        $(this).addClass('active').siblings().removeClass('active')
      })

      // 卡片旋转效果
      $('#cardRotateBtn').on('click.about', function () {
        resetOtherStatuses('cardStatus')

        const cardDemo = $('#cardDemo')
        if (cardDemo.is(':visible')) {
          cardDemo.animate(
            {
              opacity: 0,
              transform: 'rotate(-180deg)',
            },
            300,
            () => {
              cardDemo.hide().css({ opacity: 1, transform: 'rotate(0deg)' })
              updateStatus('cardStatus', '已隐藏', '#909399')
            },
          )
        } else {
          // 先隐藏个人信息演示
          $('#profileDemo').hide()
          updateStatus('profileStatus', '未激活', '#666')

          cardDemo
            .css({ opacity: 0, transform: 'rotate(-180deg)' })
            .show()
            .animate(
              {
                opacity: 1,
                transform: 'rotate(0deg)',
              },
              600,
              () => {
                updateStatus('cardStatus', '已旋转显示', '#67c23a')
              },
            )
        }

        $(this).addClass('active').siblings().removeClass('active')
      })

      // 技术栈图标悬停效果
      $('.tech-item')
        .on('mouseenter.about', function () {
          $(this).find('.tech-icon').css('transform', 'scale(1.2) rotate(5deg)')
        })
        .on('mouseleave.about', function () {
          $(this).find('.tech-icon').css('transform', 'scale(1) rotate(0)')
        })

      // 团队成员卡片效果
      $('.team-member')
        .on('mouseenter.about', function () {
          $(this).css('transform', 'translateY(-10px)')
          $(this).find('.member-avatar').css('transform', 'scale(1.1)')
        })
        .on('mouseleave.about', function () {
          $(this).css('transform', 'translateY(0)')
          $(this).find('.member-avatar').css('transform', 'scale(1)')
        })

      console.log('所有jQuery演示已加载完成')
    } catch (error) {
      console.warn('jQuery演示出错:', error)
      // 如果jQuery出错，显示友好的错误信息
      const demoBox = document.querySelector('.demo-box')
      if (demoBox) {
        demoBox.innerHTML +=
          '<p style="color: red; margin-top: 20px;">jQuery效果加载失败，请检查jQuery是否正确引入</p>'
      }
    }
  } else {
    console.warn('jQuery未加载，无法使用jQuery效果')
    // 如果jQuery未加载，显示友好的错误信息
    const demoBox = document.querySelector('.demo-box')
    if (demoBox) {
      demoBox.innerHTML +=
        '<p style="color: red; margin-top: 20px;">jQuery库未加载，请确保已正确引入jQuery</p>'
    }
  }
})

// 卸载时清理 jQuery 事件，避免内存泄漏
onBeforeUnmount(() => {
  const $ = typeof window !== 'undefined' ? window.$ || window.jQuery : null
  if ($) {
    try {
      // 移除所有带 .about 命名空间的事件
      $('#fadeBtn').off('.about')
      $('#slideBtn').off('.about')
      $('#animateBtn').off('.about')
      $('#profileSlideBtn').off('.about')
      $('#cardRotateBtn').off('.about')
      $('.tech-item').off('.about')
      $('.team-member').off('.about')
      console.log('已移除 AboutView 的 jQuery 事件')
    } catch (error) {
      console.warn('卸载 jQuery 事件时出错:', error)
    }
  }
})
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.about-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 0;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--bg-page) 100%);
  border-radius: var(--radius-lg);
}

.about-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 15px;
}

.about-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.about-section {
  margin-bottom: 50px;
  padding: 30px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: var(--text-primary);
  padding-bottom: 15px;
  border-bottom: 2px solid var(--primary-light);
}

.section-content {
  line-height: 1.8;
  color: var(--text-regular);
}

.section-content p {
  margin-bottom: 15px;
}

/* 技术栈样式 */
.tech-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: var(--bg-page);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.tech-item:hover {
  background: var(--primary-light);
  transform: translateY(-3px);
}

.tech-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

.tech-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--text-primary);
}

.tech-info p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 功能特点 */
.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.feature-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: var(--bg-page);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.feature-item:hover {
  background: var(--primary-light);
  transform: translateX(10px);
}

.feature-icon {
  color: var(--primary-color);
  flex-shrink: 0;
  margin-top: 5px;
}

.feature-item h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.feature-item p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 团队成员 */
.team-members {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.team-member {
  text-align: center;
  padding: 30px 20px;
  background: var(--bg-page);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.team-member:hover {
  background: var(--primary-light);
  transform: translateY(-10px);
  box-shadow: var(--shadow-md);
}

.member-avatar {
  font-size: 3rem;
  margin: 0 auto 20px;
  transition: transform var(--transition-fast);
}

.team-member h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--text-primary);
}

.member-role {
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.member-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

/* jQuery演示区域 */
.jquery-demo {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
}

.demo-content {
  max-width: 1000px;
  margin: 0 auto;
}

.demo-box {
  background: white;
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-md);
}

.demo-box h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 25px;
  text-align: center;
}

.demo-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.jq-btn {
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-fast);
  text-align: center;
}

.jq-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.jq-btn.active {
  background: var(--primary-dark);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.demo-target {
  background: white;
  border: 2px solid var(--primary-color);
  border-radius: var(--radius-md);
  padding: 30px;
  text-align: center;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;
}

.demo-target p {
  margin: 10px 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
}

.result-item span:first-child {
  color: #606266;
  font-weight: 500;
}

.result-item span:last-child {
  font-weight: 600;
}

@media (max-width: 768px) {
  .about-title {
    font-size: 2rem;
  }

  .about-section {
    padding: 20px;
  }

  .tech-stack,
  .features-list,
  .team-members {
    grid-template-columns: 1fr;
  }

  .demo-buttons {
    grid-template-columns: 1fr;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .jq-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .demo-box {
    padding: 20px;
  }

  .demo-buttons {
    gap: 10px;
  }

  .jq-btn {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
}
</style>
