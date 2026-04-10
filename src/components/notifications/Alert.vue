<template>
  <v-snackbar
    v-model="alert.status"
    :color="alert.type"
    location="top right"
    :timeout="5000"
    variant="elevated"
    class="notification-alert"
  >
    <div class="text-body-1">{{ alert.message }}</div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();
const { alert } = storeToRefs(notificationStore);
</script>

<style scoped>
.notification-alert {
  z-index: 9999;
}
</style>
