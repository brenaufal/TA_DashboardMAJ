import api from '@/utils/axios'

const BASE_URL = 'http://localhost:8080/qa'

export const qaService = {
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

  verify(id: number, payload: any) {
    return api.put(`${BASE_URL}/${id}`, payload, {
      withCredentials: true
    })
  }
}