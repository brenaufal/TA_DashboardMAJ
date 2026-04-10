import type { RouteRecordRaw } from 'vue-router';

const PublicRoutes: RouteRecordRaw = {
  path: '/auth',
  component: () => import('@/layouts/blank/BlankLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Login',
      path: '/login',
      component: () => import('@/views/authentication/auth/LoginPage.vue')
    },
    {
      name: 'Error404',
      path: '/error',
      component: () => import('@/views/errors/Error404Page.vue')
    }
  ]
};

export default PublicRoutes;
