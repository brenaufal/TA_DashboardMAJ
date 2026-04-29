<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form } from 'vee-validate';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/stores/Admin/auth';
import { useNotificationStore } from '@/stores/notification';

const router = useRouter();
const authStore = useAuthStore();
const notification = useNotificationStore();

const showPassword = ref(false);
const password = ref('');
const username = ref('');
const usernameTouched = ref(false)
const passwordTouched = ref(false)

const passwordRules = [
  (v: string) => !!v || 'Password wajib diisi',
  (v: string) => v === v.trim() || 'Password tidak boleh diawali atau diakhiri spasi'
];

const usernameRules = [(v: string) => !!v || 'Username wajib diisi'];

async function validate(_: unknown, { setErrors }: { setErrors: (errors: Record<string, string>) => void }) {
  try {
    notification.showLoading() // 🔥 START LOADING

    await authStore.login({
      username: username.value,
      password: password.value
    })

    notification.disableLoading()

    await router.push('/dashboard')

  } catch (error) {
    notification.disableLoading()

    const message = error instanceof Error ? error.message : 'Login gagal.'

    // ✅ cara baru (popup dialog)
    notification.showDialogError('Login Gagal', message)

    // optional: tetap isi vee-validate
    setErrors({ apiError: message })
  }
}
</script>

<template>
  <div class="text-center mb-7">
    <img src="@/assets/images/MAJ-LOGO-3.png" alt="Logo MAJ" class="brand-logo mx-auto mb-5" />
    <h1 class="mb-2 text-3xl font-bold text-slate-900">Inventory System</h1>
  </div>

  <Form v-slot="{ errors, isSubmitting }" class="login-form space-y-5" @submit="validate">
    <!-- USERNAME -->
    <div>
      <label for="username" class="block text-sm font-semibold text-slate-700">
        Username <span class="text-red-500">*</span>
      </label>

      <input
        id="username"
        v-model="username"
        @blur="usernameTouched = true"
        type="text"
        placeholder="Masukkan username"
        :class="[
          'mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition',
          usernameTouched && !username
            ? 'border-red-500 bg-blue-50 focus:ring-red-100'
            : 'border-slate-200 bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-100'
        ]"
      />

      <p v-if="usernameTouched && !username" class="mt-2 text-sm text-red-600">
        Username wajib diisi
      </p>
    </div>

    <!-- PASSWORD -->
    <div>
      <label for="password" class="block text-sm font-semibold text-slate-700">
        Password <span class="text-red-500">*</span>
      </label>

      <div class="relative mt-2">
        <input
          id="password"
          v-model="password"
          @blur="passwordTouched = true"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Masukkan password"
          :class="[
            'w-full rounded-2xl border px-4 py-3 pr-12 text-slate-900 outline-none transition',
            passwordTouched && !password
              ? 'border-red-500 bg-blue-50 focus:ring-red-100'
              : 'border-slate-200 bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600'
          ]"
        />

        <!-- ICON INSIDE INPUT -->
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-800"
        >
          <EyeInvisibleOutlined v-if="!showPassword" />
          <EyeOutlined v-else />
        </button>
      </div>

      <p v-if="passwordTouched && !password" class="mt-2 text-sm text-red-600">
        Password wajib diisi
      </p>
    </div>

    <!-- BUTTON -->
    <button
      type="submit"
      class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-blue-300"
      :disabled="isSubmitting"
    >
      <span v-if="isSubmitting" class="animate-pulse">Memproses...</span>
      <span v-else>Login</span>
    </button>

    <!-- API ERROR -->
    <div
      v-if="errors.apiError"
      class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errors.apiError }}
    </div>

  </Form>
</template>

<style scoped>
.brand-logo {
  width: 226px;
}

input:focus-visible {
  outline: none;
}

input:focus {
  border-color: rgb(59 130 246);
}
</style>
