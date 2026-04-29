<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/Admin/auth';
import { useNotificationStore } from '@/stores/notification';

const emit = defineEmits(['submit', 'close'])

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const handleSubmit = () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    notificationStore.showDialogWarning('Warning', 'Please fill in all fields')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    notificationStore.showDialogWarning('Warning', 'Password tidak cocok')
    return
  }

  emit('submit', {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value
  })
}

const handleClose = () => {
  // Reset form
  oldPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  emit('close');
};
</script>

<template>
  <div class="relative bg-white rounded-lg shadow" style="z-index: 99999;">
    <!-- Modal header -->
    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
      <h3 class="text-xl font-semibold text-gray-900">
        Change Password
      </h3>
      <button
        type="button"
        @click="handleClose"
        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
      >
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
        <span class="sr-only">Close modal</span>
      </button>
    </div>

    <!-- Modal body -->
    <div class="p-4 md:p-5">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <!-- Old Password -->
        <div>
          <label for="old-password" class="block mb-2 text-sm font-medium text-gray-900">
            Old Password
          </label>
          <div class="relative">
            <input
              v-model="oldPassword"
              :type="showOldPassword ? 'text' : 'password'"
              id="old-password"
              name="old-password"
              placeholder="Your old password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
              required
            />
            <button
              type="button"
              @click="showOldPassword = !showOldPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="!showOldPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div>
          <label for="new-password" class="block mb-2 text-sm font-medium text-gray-900">
            New Password
          </label>
          <div class="relative">
            <input
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              id="new-password"
              name="new-password"
              placeholder="new password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
              required
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900">
            Confirm New Password
          </label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirm-password"
              name="confirm-password"
              placeholder="confirm password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            @click="handleClose"
            class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
input:focus {
  border-color: rgb(59 130 246);
}
</style>