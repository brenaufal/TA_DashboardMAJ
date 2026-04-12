<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const { dialog } = storeToRefs(notificationStore)

const getColorClass = computed(() => {
  const colorMap: Record<string, string> = {
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  }
  return colorMap[dialog.value.type] || 'bg-blue-500 text-white'
})

const handleClose = () => {
  dialog.value.status = false
  dialog.value.onClose?.()
  dialog.value.onClose = () => {}
  dialog.value.onOk = null
}

const handleOk = () => {
  dialog.value.status = false
  dialog.value.onOk?.()
  dialog.value.onClose = () => {}
  dialog.value.onOk = null
}
</script>

<template>
  <!-- Overlay -->
  <div
    v-if="dialog.status"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
  >
    <!-- Modal -->
    <div class="bg-white w-full max-w-lg rounded-xl shadow-lg overflow-hidden">

      <!-- Header -->
      <div class="px-4 py-3 font-semibold text-lg" :class="getColorClass">
        {{ dialog.title }}
      </div>

      <!-- Body -->
      <div class="px-6 py-6 text-center text-base text-gray-700">
        {{ dialog.message }}
      </div>

      <!-- Divider -->
      <div class="border-t"></div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-2 p-4">
        
        <button
          v-if="dialog.onOk"
          @click="handleOk"
          class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          OK
        </button>

        <button
          @click="handleClose"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
        >
          Close
        </button>

      </div>
    </div>
  </div>
</template>