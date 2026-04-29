import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
})

// 🔥 GLOBAL ERROR HANDLER
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // 🔥 SESSION HABIS → LOGOUT
      localStorage.clear()
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default api