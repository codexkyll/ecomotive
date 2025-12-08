import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import ModelInfoView from '../views/ModelInfoView.vue'
import LivecameraView from '../views/LivecameraView.vue' 
import HistoryView from '../views/HistoryView.vue'
import AboutView from '../views/AboutView.vue'
import SignupView from '../views/SignupView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardView
    },
    {
      path: '/model-info',
      name: 'model-info',
      component: ModelInfoView
    },
    {
      path: '/live-camera',
      name: 'live-camera',
      component: LivecameraView
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/about-us',
      name: 'about-us',
      component: AboutView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
  ]
})

// Navigation Guard removed/simplified so it doesn't block you
router.beforeEach((to, from, next) => {
  next();
});

export default router