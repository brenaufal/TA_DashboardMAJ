import { defineStore } from 'pinia'
import { qaService } from '@/services/Verification/qaService'

export const useQAStore = defineStore('qa', {
  state: () => ({
    qaList: [] as any[],
    loading: false,
    error: '',

    form: {
      production_id: '',
      qa_image: null as File | null,
      notes: ''
    }
  }),

  actions: {
    async fetchQA() {
      try {
        this.loading = true
        const res = await qaService.getAll()
        this.qaList = res.data
      } catch (err) {
        console.error(err)
        this.error = 'Gagal mengambil data QA'
      } finally {
        this.loading = false
      }
    },

    async submitQA() {
      try {
        const formData = new FormData()

        formData.append('production_id', this.form.production_id)

        if (this.form.qa_image) {
          formData.append('qa_image', this.form.qa_image)
        }

        formData.append('notes', this.form.notes)

        await qaService.create(formData)

        this.resetForm()
        await this.fetchQA()

      } catch (err) {
        console.error(err)
        throw new Error('Gagal submit QA')
      }
    },

    async verifyQA(id: number, status: 'approved' | 'rejected') {
      try {
        await qaService.verify(id, { status })
        await this.fetchQA()
      } catch (err) {
        console.error(err)
        throw new Error('Gagal verifikasi QA')
      }
    },

    resetForm() {
      this.form = {
        production_id: '',
        qa_image: null,
        notes: ''
      }
    }
  }
})