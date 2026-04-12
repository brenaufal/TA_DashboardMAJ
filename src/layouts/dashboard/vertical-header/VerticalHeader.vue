<script setup lang="ts">
import { ref } from 'vue'
import { useCustomizerStore } from '@/stores/customizer'
import { useConfigStore } from '@/stores/config'
import { useAuthStore } from '@/stores/auth'
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
</script>

<template>
  <header class="w-full h-[60px] bg-white border-b flex items-center justify-between px-4">

    <!-- LEFT -->
    <div class="flex items-center gap-2">
      <button
        @click="customizer.toggleMiniSidebar()"
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
        <img
          src="/src/assets/images/users/avatar-1.png"
          class="w-8 h-8 rounded-full"
        />
        <span class="hidden sm:block text-sm font-medium">
          {{ user?.first_name ?? '' }}
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