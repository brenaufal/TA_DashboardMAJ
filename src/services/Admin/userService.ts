import axios from 'axios'

const BASE_URL = 'http://localhost:8080/users'

export const userService = {
  getAll() {
    return axios.get(BASE_URL, {
      withCredentials: true
    })
  },

  create(payload: any) {
    return axios.post(BASE_URL, payload, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  delete(id: number) {
    return axios.delete(`${BASE_URL}/${id}`, {
      withCredentials: true
    })
  },

  update(id: number, payload: any) {
    return axios.post(`${BASE_URL}/${id}`, payload, {
      withCredentials: true
    })
  }
}