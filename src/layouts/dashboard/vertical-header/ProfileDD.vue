<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/Admin/auth'
import { useNotificationStore } from '@/stores/notification'
import { useRouter } from 'vue-router'
import ChangePassword from '@/components/ChangePassword.vue'
import { LockOutlined, LogoutOutlined } from '@ant-design/icons-vue'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const showPasswordDialog = ref(false)

const handlePasswordChange = async (data: {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}) => {
  try {
    await authStore.changePassword(data)

    notificationStore.showAlertSuccess('Password berhasil diubah')

    showPasswordDialog.value = false
  } catch (e: any) {
    notificationStore.showAlertError(e.message)
  }
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
      <!-- Avatar utama -->
      <div class="relative w-8 h-8 rounded-full mr-3 overflow-hidden border border-gray-200 bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center">
    
        <img
          v-if="authStore.user?.profile_pic"
          :src="`http://localhost:8080/uploads/profile/${authStore.user.profile_pic}`"
          class="w-full h-full object-cover"
          alt="user"
        />
        
        <!-- Fallback kalau tidak ada foto -->
        <span v-else class="text-blue-500 font-semibold text-xs">
          {{ authStore.user?.nama?.charAt(0).toUpperCase() ?? '-' }}
        </span>
      </div>

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