<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div class="dashboard-shell min-h-screen px-6 py-10">
    <div class="mx-auto max-w-6xl">
      <div class="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Dashboard MAJ</p>
          <h1 class="text-3xl font-bold text-slate-900">Halo, {{ authStore.user?.fullname }}</h1>
          <p class="mt-2 max-w-2xl text-sm text-slate-600">
            Login mock berhasil. Nanti bagian ini tinggal kita sambungkan ke backend CI4.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-xl border border-red-700 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-700 hover:text-white"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Role</p>
          <h2 class="mb-2 text-2xl font-bold text-slate-900">{{ authStore.user?.role }}</h2>
          <p class="text-sm text-slate-600">Contoh data user yang diambil dari store auth sementara.</p>
        </section>
        <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Mode</p>
          <h2 class="mb-2 text-2xl font-bold text-slate-900">Frontend Only</h2>
          <p class="text-sm text-slate-600">Saat backend belum ada, validasi login menggunakan data dummy lokal.</p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(58, 134, 255, 0.14), transparent 32%),
    linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
}
</style>
