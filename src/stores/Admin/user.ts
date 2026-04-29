import { defineStore } from 'pinia'
import { userService } from '@/services/Admin/userService'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

export const useUserStore = defineStore('user', {
  state: () => ({
  users: [] as any[],
  loading: false,
  error: '',

  form: {
    nama: '',
    username: '',
    role: '',
    line_area: [] as string[],
    password: '',
    confirmPassword: '',
    profile_pic: null as File | null
  },

  editForm: {
    id: '',
    nama: '',
    username: '',
    role: '',
    line_area: [] as string[],
    password: '',
    confirmPassword: '',
    profile_pic: null as any
  }
}),

  actions: {
    resetForm() {
      this.form = {
        nama: '',
        username: '',
        role: '',
        line_area: [],
        password: '',
        confirmPassword: '',
        profile_pic: null
      }
    },
    setEditUser(user: any) {
      this.editForm = {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role || '',
        line_area: user.line_area ? [...user.line_area] : [],
        password: '',
        confirmPassword: '',
        profile_pic: user.profile_pic || null
      }
    },
    async fetchUsers() {
      try {
        this.loading = true

        const res = await userService.getAll()

        this.users = res.data

      } catch (err) {
        console.error(err)
        this.error = 'Gagal mengambil data user'
        // notificationStore.showAlertError('Gagal mengambil data user')
      } finally {
        this.loading = false
      }
    },

    async createUser() {
      if (!this.form.nama || !this.form.username || !this.form.password) {
        throw new Error('Field wajib diisi')
      }

      if (this.form.password !== this.form.confirmPassword) {
        throw new Error('Password tidak cocok')
      }

      try {
        const formData = new FormData()

        formData.append('nama', this.form.nama)
        formData.append('username', this.form.username)
        formData.append('role', this.form.role)
        formData.append('password', this.form.password)

        formData.append('line_area', JSON.stringify(this.form.line_area))

        if (this.form.profile_pic) {
          formData.append('profile_pic', this.form.profile_pic)
        }

        await userService.create(formData)

        notificationStore.showAlertSuccess('User berhasil ditambahkan')
        this.resetForm()
        await this.fetchUsers()

      } catch (err) {
        console.error(err)
        throw new Error('Gagal menambahkan user')
      }
    },

    async deleteUser(id: number) {
      try {
        await userService.delete(id)

        this.users = this.users.filter(u => u.id !== id)
        notificationStore.showAlertSuccess('User berhasil dihapus')
      } catch (err) {
        console.error(err)
        throw new Error('Gagal menghapus user')
      }
    },

    async updateUser() {
      if (!this.editForm.nama || !this.editForm.username) {
        throw new Error('Nama dan username wajib diisi')
      }

      if (
        this.editForm.password &&
        this.editForm.password !== this.editForm.confirmPassword
      ) {
        throw new Error('Password tidak cocok')
      }

      try {
        const formData = new FormData()

        formData.append('nama', this.editForm.nama)
        formData.append('username', this.editForm.username)
        formData.append('role', this.editForm.role)

        formData.append('line_area', JSON.stringify(this.editForm.line_area))

        if (this.editForm.password) {
          formData.append('password', this.editForm.password)
        }

        if (this.editForm.profile_pic instanceof File) {
          formData.append('profile_pic', this.editForm.profile_pic)
        }

        await userService.update(this.editForm.id, formData)
        
        notificationStore.showAlertSuccess('User berhasil diupdate')
        await this.fetchUsers()

      } catch (err) {
        console.error(err)
        throw new Error('Gagal update user')
      }
    }
  }
})