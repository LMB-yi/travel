<!-- src/App.vue -->
<template>
  <div id="app">
    <Header v-if="showHeader" />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

const route = useRoute()

// 在登录注册页面不显示Header和Footer
const showHeader = computed(() => {
  return !['login', 'register'].includes(route.name)
})

const showFooter = computed(() => {
  return !['login', 'register'].includes(route.name)
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
}

/* 页面切换动画 */
.page-enter-active {
  animation: pageIn 0.4s;
}

.page-leave-active {
  animation: pageOut 0.3s;
}

@keyframes pageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pageOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>