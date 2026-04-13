import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    isAuthenticated: false
  }),

  actions: {
    async login(payload: { username: string; password: string }) {
      try {
        const res = await axios.post('http://localhost:8080/login', {
          nama: payload.username,
          password: payload.password
        }, 
        {
          withCredentials: true // 🔥 REQUIRED
        })
        
        this.user = res.data.user
        this.isAuthenticated = true

        // save to localStorage
        localStorage.setItem('user', JSON.stringify(res.data.user))

      } catch (err: any) {
        throw new Error(err.response?.data?.messages?.error || 'Login gagal')
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
    },

    loadUser() {
      const data = localStorage.getItem('user')
      if (data) {
        this.user = JSON.parse(data)
        this.isAuthenticated = true
      }
    }
  }
})