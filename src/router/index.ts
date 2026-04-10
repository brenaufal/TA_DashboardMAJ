import { createRouter, createWebHistory } from 'vue-router';
import PublicRoutes from './PublicRoutes';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/DashboardPage.vue')
        }
      ]
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
    return '/dashboard';
  }

  return true;
});

export default router;
