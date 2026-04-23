<script setup lang="ts">
import { ref } from 'vue'
import { useCustomizerStore } from '@/stores/customizer'
import { useConfigStore } from '@/stores/config'
import { useAuthStore } from '@/stores/Admin/auth'
import { storeToRefs } from 'pinia'

import ProfileDD from './ProfileDD.vue'

const customizer = useCustomizerStore()
const configStore = useConfigStore()
const authStore = useAuthStore()

const { page } = storeToRefs(configStore)
const { user } = storeToRefs(authStore)

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleToggle = () => {
  customizer.mini_sidebar = !customizer.mini_sidebar
}
</script>

<template>
  <header class="w-full h-[60px] bg-white border-b flex items-center justify-between px-4">

    <!-- LEFT -->
    <div class="flex items-center gap-2">
      <button
        @click="handleToggle()"
        class="p-2 rounded hover:bg-gray-100 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 v-if="page?.name" class="text-sm font-semibold text-gray-700">
        {{ page.name }}
      </h1>
    </div>

    <!-- RIGHT -->
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition"
      >
        <!-- Avatar utama -->
        <div class="relative w-8 h-8 rounded-full mr-3 overflow-hidden border border-gray-200 bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center">
          
          <img
            v-if="user?.profile_pic"
            :src="`http://localhost:8080/uploads/profile/${user.profile_pic}`"
            class="w-full h-full object-cover"
            alt="user"
          />
          
          <!-- Fallback kalau tidak ada foto -->
          <span v-else class="text-blue-500 font-semibold text-xs">
            {{ user?.nama?.charAt(0).toUpperCase() ?? '-' }}
          </span>
        </div>

        <span class="hidden sm:block text-sm font-medium">
          {{ user?.nama ?? '' }}
        </span>
      </button>

      <div
        v-show="isOpen"
        class="absolute right-0 mt-2 w-[290px] bg-white border rounded-xl shadow-lg z-50"
      >
        <ProfileDD />
      </div>
    </div>

  </header>
</template>