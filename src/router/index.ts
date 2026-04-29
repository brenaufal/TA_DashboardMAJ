import { createRouter, createWebHistory } from 'vue-router';
import PublicRoutes from './PublicRoutes';
import { useAuthStore } from '@/stores/Admin/auth';
import { getActivePinia } from 'pinia'

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
          component: () => import('@/views/dashboard/Dashboard.vue')
        },
        {
          path: 'production/stamping',
          name: 'Production',
          component: () => import('@/views/production/Stamping/Production.vue'),
          meta: { requiresAuth: true, role: ["Admin", "Manager", "Supervisor", "Operator"] }
        },
        {
          path: 'production/welding',
          name: 'ProductionWelding',
          component: () => import('@/views/production/Welding/Production.vue'),
          meta: { requiresAuth: true, role: ["Admin", "Manager", "Supervisor", "Operator"] }
        },
        {
          path: "report/stamping",
          component: () => import("@/views/report/Stamping/Report.vue"),
          meta: { requiresAuth: true, role: ["Admin", "Manager", "Supervisor", "Operator"] }
        },
        {
          path: "report/welding",
          component: () => import("@/views/report/Welding/Report.vue"),
          meta: { requiresAuth: true, role: ["Admin", "Manager", "Supervisor", "Operator"] }
        },
        {
          path: 'admin/user-management',
          name: 'UserManagement',
          component: () => import('@/views/admin/UserManagement.vue'),
          meta: { requiresAuth: true, role: ["Admin", "Manager"] }
        },
        {
          path: 'verification/qa',
          name: 'QAVerification',
          component: () => import('@/views/admin/Verification/QAVerification.vue'),
          meta: { requiresAuth: true, role: ["Admin", "Manager", "Supervisor"] }
        },
        // {
        //   path: 'verification/qc',
        //   name: 'QCVerification',
        //   component: () => import('@/views/production/Verification/QCVerification.vue'),
        //   meta: { requiresAuth: true, role: ["Admin", "Manager"] }
        // },
        {
          path: 'unauthorized',
          name: 'Unauthorized',
          component: () => import('@/views/unauthorized.vue')
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
  const pinia = getActivePinia()
  if (!pinia) return true

  const authStore = useAuthStore(pinia)

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (to.meta.role) {
    const allowedRoles = Array.isArray(to.meta.role)
      ? to.meta.role
      : [to.meta.role]

    const userRole = authStore.role // BENAR
    const isSuperUser = ["Admin", "Manager"].includes(userRole) // sesuai DB

    if (!isSuperUser && !allowedRoles.includes(userRole)) {
      return '/unauthorized'
    }
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    return '/dashboard'
  }

  return true
})

export default router;
