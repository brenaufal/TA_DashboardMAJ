<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import ChangePassword from '@/components/ChangePassword.vue'
import { LockOutlined, LogoutOutlined } from '@ant-design/icons-vue'

const authStore = useAuthStore()
const user = authStore.user
const router = useRouter()

const showPasswordDialog = ref(false)

const handlePasswordChange = (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
  console.log('Password change requested:', data)
  showPasswordDialog.value = false
}

const handleCloseDialog = () => {
  showPasswordDialog.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
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
        <h6 class="text-sm font-semibold text-slate-800 capitalize">
          {{ authStore.user?.nama ?? '-' }}
        </h6>
        <p class="text-xs text-blue-600 font-medium">
          {{ authStore.user?.role ?? '-' }}
        </p>
      </div>
    </div>

    <!-- Menu -->
    <div class="py-1">

      <!-- Change Password -->
      <button
        @click="showPasswordDialog = true"
        class="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition"
      >
        <LockOutlined class="text-blue-600 text-lg" />
        Change Password
      </button>

      <!-- Logout -->
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
      >
        <LogoutOutlined class="text-red-500 text-lg" />
        Logout
      </button>

    </div>
  </div>

  <div
    v-if="showPasswordDialog"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
  >
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">
      
      <ChangePassword
        @close="handleCloseDialog"
        @submit="handlePasswordChange"
      />

    </div>
  </div>
</template>