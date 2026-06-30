// src/router/index.js
// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

// 导入视图组件
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const HomeView = () => import('@/views/HomeView.vue')
const TripList = () => import('@/views/TripList.vue')
const TripDetail = () => import('@/views/TripDetail.vue')
const TripEdit = () => import('@/views/TripEdit.vue')
const UserProfile = () => import('@/views/UserProfile.vue')
const AboutView = () => import('@/views/AboutView.vue')
const Explore = () => import('@/views/Explore.vue')
const AttractionDetail = () => import('@/views/AttractionDetail.vue')
const NotFound = () => import('@/views/NotFound.vue')
const Admin = () => import('@/views/Admin.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    // 允许未登录用户访问首页，首页会在导航栏显示登录按钮
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guestOnly: false }, // 已注释掉，允许已登录用户访问
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { guestOnly: false }, // 已注释掉，允许已登录用户访问
  },
  {
    path: '/trips',
    name: 'trips',
    component: TripList,
    meta: { requiresAuth: false }, // 已注释掉，允许未登录用户访问
  },
  {
    path: '/trips/new',
    name: 'trip-new',
    component: TripEdit,
    meta: { requiresAuth: false }, // 已注释掉，允许未登录用户访问
  },
  {
    path: '/trips/:id',
    name: 'trip-detail',
    component: TripDetail,
    meta: { requiresAuth: false }, // 已注释掉，允许未登录用户访问
    props: true,
  },
  {
    path: '/trips/:id/edit',
    name: 'trip-edit',
    component: TripEdit,
    meta: { requiresAuth: false }, // 已注释掉，允许未登录用户访问
    props: true,
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfile,
    meta: { requiresAuth: false }, // 已注释掉，允许未登录用户访问
  },
  {
    path: '/explore',
    name: 'explore',
    component: Explore,
    meta: { requiresAuth: false }, // 已注释掉，允许未登录用户访问
  },
  {
    path: '/attractions/:id',
    name: 'attraction-detail',
    component: AttractionDetail,
    meta: { requiresAuth: false }, // 已注释掉，允许未登录用户访问
    props: true,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requiresAuth: false, requiresAdmin: false }, // 已注释掉，允许未登录用户访问
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes,
// })
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫 - 认证检查（已注释掉强制登录检查）
router.beforeEach((to, from, next) => {
  // const authStore = useAuthStore()

  // 已注释掉强制登录检查，让访问者可以直接使用所有功能
  // // 检查是否需要登录
  // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  //   next({ name: 'login' })
  // }
  // // 检查是否需要管理员权限
  // else if (to.meta.requiresAdmin && authStore.user?.is_admin !== 1) {
  //   next({ name: 'home' })
  // }
  // // 检查是否仅允许未登录用户访问（如登录页面）
  // else if (to.meta.guestOnly && authStore.isAuthenticated) {
  //   next({ name: 'home' })
  // } else {
  //   next()
  // }

  // 直接放行所有路由
  next()
})

export default router
