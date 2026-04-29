import { defineStore } from 'pinia'
// import { authService } from '@/services/Admin/authService'
import { useNotificationStore } from '@/stores/notification'
import api from '@/utils/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    role: '' as string, 
    isAuthenticated: false
  }),

  actions: {
    async login(payload: { username: string; password: string }) {
      const notificationStore = useNotificationStore()
      try {
        const res = await api.post('http://localhost:8080/login', {
          username: payload.username,
          password: payload.password
        }, 
        {
          withCredentials: true
        })
        
        this.user = res.data.user
        this.role = res.data.user.role
        this.isAuthenticated = true

        // save to localStorage
        localStorage.setItem('user', JSON.stringify(res.data.user))

        // notificationStore.showDialogSuccess('Login', 'Login berhasil')

      } catch (err: any) {
        notificationStore.showDialogError('Login', 'Login gagal')
        throw new Error(err.response?.data?.messages?.error || 'Login gagal')
      }
    },
    logout() {
      this.user = null
      this.role = ''
      this.isAuthenticated = false
      localStorage.removeItem('user')
    },
    loadUser() {
      const data = localStorage.getItem('user')
      if (data) {
        this.user = JSON.parse(data)
        this.role = this.user.role // ✅ penting
        this.isAuthenticated = true
      }
    },
    checkRole(roles: string | string[]): boolean {
      if (!this.role) return false

      const allowed = Array.isArray(roles) ? roles : [roles]
      return allowed.includes(this.role)
    },

    isSuperUser(): boolean {
      return ['Admin', 'Manager'].includes(this.role)
    },
    async changePassword(payload: {
      oldPassword: string
      newPassword: string
      confirmPassword: string
    }) {
      const notificationStore = useNotificationStore()
      try {
        const res = await api.post(
          'http://localhost:8080/change-password',
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        )

        notificationStore.showDialogSuccess('Password', 'Password berhasil diubah')
        return res.data
      } catch (err: any) {
        notificationStore.showDialogError('Password', 'Password gagal diubah')
        throw new Error(err.response?.data?.messages?.error || 'Gagal mengganti password')
      }
    }
  }
})