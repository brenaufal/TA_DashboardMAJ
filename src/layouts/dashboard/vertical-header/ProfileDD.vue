<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ChangePassword from '@/components/ChangePassword.vue'

const authStore = useAuthStore()
const user = authStore.user

const showPasswordDialog = ref(false)

const handlePasswordChange = (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
  console.log('Password change requested:', data)
  showPasswordDialog.value = false
}

const handleCloseDialog = () => {
  showPasswordDialog.value = false
}
</script>

<template>
  <div class="w-full">

    <!-- User Info -->
    <div class="flex items-center p-4 border-b">
      <img
        src="/src/assets/images/users/avatar-1.png"
        class="w-8 h-8 rounded-full mr-3"
        alt="user"
      />

      <div class="flex-1">
        <h6 class="text-sm font-semibold">
          {{ authStore.user?.fullname ?? '' }}
        </h6>
        <p class="text-xs text-gray-500">
          {{ authStore.user?.username ?? '' }}
        </p>
      </div>
    </div>

    <!-- Menu -->
    <div class="py-1">

      <!-- Change Password -->
      <button
        @click="showPasswordDialog = true"
        class="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition"
      >
        <!-- Edit Icon -->
        <svg class="w-6 h-6 text-blue-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"/>
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
        </svg>

        Change Password
      </button>

      <!-- Logout -->
      <button
        @click="authStore.logout()"
        class="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-500 transition"
      >
        <!-- Logout Icon -->
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
        </svg>

        Logout
      </button>

    </div>
  </div>

  <!-- 🔥 Tailwind Modal (Replace v-dialog) -->
  <div
    v-if="showPasswordDialog"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
  >
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">
      
      <!-- Content -->
      <ChangePassword
        @close="handleCloseDialog"
        @submit="handlePasswordChange"
      />

    </div>
  </div>
</template>