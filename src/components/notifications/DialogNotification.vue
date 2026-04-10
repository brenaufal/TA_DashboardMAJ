<template>
  <v-dialog v-model="dialog.status" persistent max-width="600">
    <v-card>
      <v-card-title class="text-h5 pa-4" :class="getColorClass">
        {{ dialog.title }}
      </v-card-title>

      <v-card-text class="pa-6 text-h6 text-center">
        {{ dialog.message }}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-btn
          v-if="dialog.onOk"
          color="warning"
          variant="elevated"
          @click="handleOk"
        >
          OK
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="handleClose"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();
const { dialog } = storeToRefs(notificationStore);

const getColorClass = computed(() => {
  const colorMap: Record<string, string> = {
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    info: 'bg-info text-white',
  };
  return colorMap[dialog.value.type] || 'bg-info text-white';
});

const handleClose = () => {
  dialog.value.status = false;
  if (dialog.value.onClose) {
    dialog.value.onClose();
  }
  dialog.value.onClose = () => {};
  dialog.value.onOk = null;
};

const handleOk = () => {
  dialog.value.status = false;
  if (dialog.value.onOk) {
    dialog.value.onOk();
  }
  dialog.value.onClose = () => {};
  dialog.value.onOk = null;
};
</script>
