<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notification'
import { watch } from 'vue'

const notificationStore = useNotificationStore()
const { alert } = storeToRefs(notificationStore)

// auto close (replace timeout)
watch(alert, (val) => {
  if (val.status) {
    setTimeout(() => {
      alert.value.status = false
    }, 5000)
  }
})
</script>

<template>
  <div
    v-show="alert.status"
    class="fixed top-4 right-4 z-[9999] transition-all"
  >
    <div
      class="min-w-[250px] max-w-sm p-4 rounded-lg shadow-lg text-white"
      :class="{
        'bg-green-500': alert.type === 'success',
        'bg-red-500': alert.type === 'error',
        'bg-yellow-500': alert.type === 'warning',
        'bg-blue-500': alert.type === 'info'
      }"
    >
      <p class="text-sm font-medium">
        {{ alert.message }}
      </p>
    </div>
  </div>
</template>