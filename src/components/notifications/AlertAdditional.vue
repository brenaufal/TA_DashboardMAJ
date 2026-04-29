<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();
const { alertAdditional } = storeToRefs(notificationStore);

// 🎨 warna alert
const alertColor = computed(() => {
  if (alertAdditional.value.type === 'success') return 'text-green-800 border border-green-300 bg-green-50';
  if (alertAdditional.value.type === 'error') return 'text-red-800 border border-red-300 bg-red-50';
  return 'text-blue-800 border border-blue-300 bg-blue-50';
});

const iconBg = computed(() => {
  if (alertAdditional.value.type === 'success') return 'bg-green-100 text-green-500';
  if (alertAdditional.value.type === 'error') return 'bg-red-100 text-red-500';
  return 'bg-blue-100 text-blue-500';
});

// ❌ close manual
const closeAlert = () => {
  alertAdditional.value.status = false;
};

// ⏱ auto close 5 detik
watch(
  () => alertAdditional.value.status,
  (val) => {
    if (val) {
      setTimeout(() => {
        alertAdditional.value.status = false;
      }, 5000);
    }
  }
);
</script>

<template>
  <div
    v-if="alertAdditional.status"
    class="fixed top-20 right-5 z-[9999] flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-2xl shadow-lg"
    :class="alertColor"
    role="alert"
  >
    <!-- ICON -->
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
      :class="iconBg"
    >
      <svg
        v-if="alertAdditional.type === 'success'"
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 
        0l-4-4a1 1 0 011.414-1.414L8 
        12.586l7.293-7.293a1 1 0 011.414 0z"/>
      </svg>

      <svg
        v-else-if="alertAdditional.type === 'error'"
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 18a8 8 0 100-16 8 8 0 000 
        16zm-1-10h2v4H9V8zm0 
        6h2v2H9v-2z"/>
      </svg>

      <svg
        v-else
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M18 10A8 8 0 11
        2 10a8 8 0 0116 0zM9 
        9h2v5H9V9zm0-4h2v2H9V5z"/>
      </svg>
    </div>

    <!-- MESSAGE -->
    <div class="ml-3 text-sm font-normal">
      {{ alertAdditional.message }}
    </div>

    <!-- CLOSE BUTTON -->
    <button
      @click="closeAlert"
      type="button"
      class="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg p-1.5 inline-flex h-8 w-8"
    >
      ✕
    </button>
  </div>
</template>