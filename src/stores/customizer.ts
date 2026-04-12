import { defineStore } from 'pinia'

export const useCustomizerStore = defineStore('customizer', {
  state: () => ({
    Sidebar_drawer: true,
    mini_sidebar: false,
    actTheme: 'light',
    fontTheme: 'default'
  }),

  actions: {
    SET_SIDEBAR_DRAWER() {
      this.Sidebar_drawer = !this.Sidebar_drawer
    },

    toggleMiniSidebar() {
      this.mini_sidebar = !this.mini_sidebar
    },

    SET_THEME(payload: string) {
      this.actTheme = payload
    },

    SET_FONT(payload: string) {
      this.fontTheme = payload
    }
  }
})