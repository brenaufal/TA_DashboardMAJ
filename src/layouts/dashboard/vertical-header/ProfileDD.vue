<script setup lang="ts">
import { LogoutOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- profile DD -->
  <!-- ---------------------------------------------- -->
  <div>
    <div class="d-flex align-center pa-5">
      <v-avatar size="32" class="mr-2">
        <img src="@/assets/images/users/avatar-1.png" width="32" alt="Julia" />
      </v-avatar>
      <div>
        <h6 class="text-h6 mb-0">{{ authStore.user?.fullname ?? '' }}</h6>
        <p class="text-caption mb-0">{{ authStore.user?.username ?? '' }}</p>
      </div>
      <div class="ml-auto">
        <v-btn variant="text" color="primary" rounded="sm" icon size="large" @click="handleLogout">
          <LogoutOutlined :style="{ fontSize: '20px' }" />
        </v-btn>
      </div>
    </div>
    <v-list class="py-0" aria-label="list" aria-busy="false">
      <v-list-item @click="handleLogout" color="primary" rounded="0">
        <template #prepend>
          <LogoutOutlined :style="{ fontSize: '14px' }" class="mr-4" />
        </template>

        <v-list-item-title class="text-subtitle-2">Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<style scoped>
.v-list {
  overflow-x: hidden !important;
}

.v-list-item {
  overflow-x: hidden !important;
}

.v-list-item-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
