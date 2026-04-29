import api from '@/utils/axios'

const BASE_URL = 'http://localhost:8080/users'

export const userService = {
  getAll() {
    return api.get(BASE_URL, {
      withCredentials: true
    })
  },

  create(payload: any) {
    return api.post(BASE_URL, payload, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  delete(id: number) {
    return api.delete(`${BASE_URL}/${id}`, {
      withCredentials: true
    })
  },

  update(id: number, payload: any) {
    return api.post(`${BASE_URL}/${id}`, payload, {
      withCredentials: true
    })
  }
}