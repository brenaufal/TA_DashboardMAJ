<template>
  <v-snackbar
    v-model="alertAdditional.status"
    :color="alertAdditional.type"
    location="top right"
    :timeout="5000"
    variant="elevated"
    class="notification-alert-additional"
    :style="{ top: '80px' }"
  >
    <div class="text-body-1">{{ alertAdditional.message }}</div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();
const { alertAdditional } = storeToRefs(notificationStore);
</script>

<style scoped>
.notification-alert-additional {
  z-index: 9999;
}
</style>
