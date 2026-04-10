<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-6">
    <div class="text-center">
      <p class="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">404</p>
      <h1 class="mb-3 text-3xl font-bold text-slate-900">Halaman tidak ditemukan</h1>
      <p class="mb-6 text-sm text-slate-600">Route yang kamu buka belum tersedia di project TA ini.</p>
      <router-link
        to="/login"
        class="inline-flex items-center rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
      >
        Kembali ke login
      </router-link>
    </div>
  </div>
</template>
