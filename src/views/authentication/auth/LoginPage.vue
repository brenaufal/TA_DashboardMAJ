<script setup lang="ts">
import AuthLogin from '../authForms/AuthLogin.vue';
</script>

<template>
  <section class="login-page relative min-h-screen overflow-hidden">
    <div class="blur-logo pointer-events-none absolute inset-x-0 bottom-0" aria-hidden="true">
      <svg width="100%" height="calc(100vh - 175px)" viewBox="0 0 405 809" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M-358.39 358.707L-293.914 294.23L-293.846 294.163H-172.545L-220.81 342.428L-233.272 354.889L-282.697 404.314L-276.575 410.453L0.316589 687.328L283.33 404.314L233.888 354.889L230.407 351.391L173.178 294.163H294.48L294.547 294.23L345.082 344.765L404.631 404.314L0.316589 808.629L-403.998 404.314L-358.39 358.707ZM0.316589 0L233.938 233.622H112.637L0.316589 121.301L-112.004 233.622H-233.305L0.316589 0Z"
          fill="#69b1ff"
        />
        <path
          d="M-516.39 358.707L-451.914 294.23L-451.846 294.163H-330.545L-378.81 342.428L-391.272 354.889L-440.697 404.314L-434.575 410.453L-157.683 687.328L125.33 404.314L75.8879 354.889L72.4068 351.391L15.1785 294.163H136.48L136.547 294.23L187.082 344.765L246.631 404.314L-157.683 808.629L-561.998 404.314L-516.39 358.707ZM-157.683 0L75.9383 233.622H-45.3627L-157.683 121.301L-270.004 233.622H-391.305L-157.683 0Z"
          fill="#d82229"
          opacity="0.6"
        />
        <path
          d="M-647.386 358.707L-582.91 294.23L-582.842 294.163H-461.541L-509.806 342.428L-522.268 354.889L-571.693 404.314L-565.571 410.453L-288.68 687.328L-5.66624 404.314L-55.1082 354.889L-58.5893 351.391L-115.818 294.163H5.48342L5.5507 294.23L56.0858 344.765L115.635 404.314L-288.68 808.629L-692.994 404.314L-647.386 358.707ZM-288.68 0L-55.0578 233.622H-176.359L-288.68 121.301L-401 233.622H-522.301L-288.68 0Z"
          fill="#fff1f0"
        />
      </svg>
    </div>

    <div class="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
      <div class="w-full max-w-5xl">
        <div class="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="hidden lg:block">
            <p class="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-red-700">Prototype Tugas Akhir</p>
            <h1 class="max-w-xl text-5xl font-black leading-tight text-slate-900">
              Dashboard PT. Mekar Armada Jaya.
            </h1>
          </div>

          <div class="login-box mx-auto w-full max-w-md rounded-[28px] border border-white/60 bg-white/85 p-8 shadow-2xl shadow-slate-300/40 backdrop-blur">
            <AuthLogin />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(58, 134, 255, 0.18), transparent 30%),
    linear-gradient(160deg, #f8fafc 0%, #eef2f7 60%, #fff1f0 100%);
}

.blur-logo {
  filter: blur(18px);
  opacity: 0.9;
}
</style>
