import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/verifications',
  },
  {
    path: '/verifications',
    name: 'verifications',
    component: () => import('@/views/VerificationList.vue'),
  },
  {
    path: '/verifications/new',
    name: 'verification-new',
    component: () => import('@/views/VerificationForm.vue'),
  },
  {
    path: '/verifications/:id',
    name: 'verification-detail',
    component: () => import('@/views/VerificationDetail.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
