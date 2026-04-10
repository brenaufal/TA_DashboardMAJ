<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form } from 'vee-validate';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const password = ref('');
const username = ref('');

const passwordRules = [
  (v: string) => !!v || 'Password wajib diisi',
  (v: string) => v === v.trim() || 'Password tidak boleh diawali atau diakhiri spasi'
];

const usernameRules = [(v: string) => !!v || 'Username wajib diisi'];

async function validate(_: unknown, { setErrors }: { setErrors: (errors: Record<string, string>) => void }) {
  try {
    await authStore.login({
      username: username.value,
      password: password.value
    });

    await router.push('/');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login gagal.';
    setErrors({ apiError: message });
  }
}
</script>

<template>
  <div class="text-center mb-7">
    <img src="@/assets/images/MAJ-LOGO-3.png" alt="Logo MAJ" class="brand-logo mx-auto mb-5" />
    <h1 class="mb-2 text-3xl font-bold text-slate-900">Inventory System</h1>
    <!-- <p class="text-sm leading-6 text-slate-600">
      Login sementara menggunakan data dummy sampai backend CI4 siap.
    </p> -->
  </div>

  <Form v-slot="{ errors, isSubmitting }" class="login-form" @submit="validate">
    <div class="mb-5">
      <label for="username" class="block text-sm font-semibold text-slate-700">Username</label>
      <input
        id="username"
        v-model="username"
        aria-label="Username"
        type="text"
        class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
      />
      <p v-if="username && typeof usernameRules[0](username) === 'string'" class="mt-2 text-sm text-red-700">
        {{ usernameRules[0](username) }}
      </p>
    </div>

    <div>
      <label for="password" class="block text-sm font-semibold text-slate-700">Password</label>
      <div class="mt-2 flex items-center rounded-2xl border border-slate-200 bg-white pr-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">
        <input
          id="password"
          v-model="password"
          aria-label="Password"
          :type="showPassword ? 'text' : 'password'"
          class="w-full rounded-2xl bg-transparent px-4 py-3 text-slate-900 outline-none"
        />
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          @click="showPassword = !showPassword"
        >
          <EyeInvisibleOutlined v-if="!showPassword" />
          <EyeOutlined v-else />
        </button>
      </div>
      <p
        v-if="password && passwordRules.map((rule) => rule(password)).find((result) => typeof result === 'string')"
        class="mt-2 text-sm text-red-700"
      >
        {{ passwordRules.map((rule) => rule(password)).find((result) => typeof result === 'string') }}
      </p>
    </div>

    <button
      type="submit"
      class="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? 'Memproses...' : 'Login' }}
    </button>

    <div v-if="errors.apiError" class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errors.apiError }}
    </div>

    <div class="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
      Coba login dengan `manager / manager123` atau `supervisor / supervisor123`.
    </div>
  </Form>
</template>

<style scoped>
.brand-logo {
  width: 226px;
}
</style>
