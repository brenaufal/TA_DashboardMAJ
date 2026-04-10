import { createRouter, createWebHistory } from 'vue-router';
import PublicRoutes from './PublicRoutes';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      meta: {
        requiresAuth: true
      },
      component: () => import('@/views/dashboard/DashboardPage.vue')
    },
    PublicRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error'
    }
  ]
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login';
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    return '/';
  }

  return true;
});

export default router;
