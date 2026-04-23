<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { useCustomizerStore } from '@/stores/customizer'

// import LoadingBar from '@/components/apps/LoadingBar.vue'
import Sidebar from './vertical-sidebar/Sidebar.vue'
import VerticalHeader from './vertical-header/VerticalHeader.vue'

import {
  Alert,
  AlertAdditional,
  DialogNotification,
  LoadingOverlay
} from '@/components/notifications'

const customizer = useCustomizerStore();

onMounted(() => {
  initFlowbite()
})
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Area -->
    <div
      :class="[
        'flex flex-col flex-1 overflow-hidden transition-all duration-300',

        customizer.Sidebar_drawer
          ? (customizer.mini_sidebar ? 'ml-[80px]' : 'ml-[280px]')
          : 'ml-0'
      ]"
    >
      
      <!-- Header -->
      <VerticalHeader />

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <LoadingOverlay />
        <RouterView />
      </main>

    </div>

    <!-- Global Components -->
    <LoadingOverlay />
    <DialogNotification />
    <Alert />
    <AlertAdditional />

  </div>
</template>