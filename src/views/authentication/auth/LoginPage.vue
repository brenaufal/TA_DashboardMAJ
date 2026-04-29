<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import AuthLogin from '../authForms/AuthLogin.vue';

const currentSlide = ref(0);

const plantImages = [
  '/src/assets/images/image.png',
  '/src/assets/images/tmmin.png',
  '/src/assets/images/plant.png'
];

let slideInterval: any = null;

onMounted(() => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % plantImages.length;
  }, 4000);
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>

<template>
  <section class="login-page relative min-h-screen overflow-hidden flex items-center justify-center">
    
    <div class="blur-logo pointer-events-none absolute inset-x-0 bottom-0" aria-hidden="true">
      <svg width="100%" height="calc(100vh - 175px)" viewBox="0 0 405 809" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-358.39 358.707L-293.914 294.23L-293.846 294.163H-172.545L-220.81 342.428L-233.272 354.889L-282.697 404.314L-276.575 410.453L0.316589 687.328L283.33 404.314L233.888 354.889L230.407 351.391L173.178 294.163H294.48L294.547 294.23L345.082 344.765L404.631 404.314L0.316589 808.629L-403.998 404.314L-358.39 358.707ZM0.316589 0L233.938 233.622H112.637L0.316589 121.301L-112.004 233.622H-233.305L0.316589 0Z" fill="#69b1ff" />
        <path d="M-516.39 358.707L-451.914 294.23L-451.846 294.163H-330.545L-378.81 342.428L-391.272 354.889L-440.697 404.314L-434.575 410.453L-157.683 687.328L125.33 404.314L75.8879 354.889L72.4068 351.391L15.1785 294.163H136.48L136.547 294.23L187.082 344.765L246.631 404.314L-157.683 808.629L-561.998 404.314L-516.39 358.707ZM-157.683 0L75.9383 233.622H-45.3627L-157.683 121.301L-270.004 233.622H-391.305L-157.683 0Z" fill="#d82229" opacity="0.6" />
        <path d="M-647.386 358.707L-582.91 294.23L-582.842 294.163H-461.541L-509.806 342.428L-522.268 354.889L-571.693 404.314L-565.571 410.453L-288.68 687.328L-5.66624 404.314L-55.1082 354.889L-58.5893 351.391L-115.818 294.163H5.48342L5.5507 294.23L56.0858 344.765L115.635 404.314L-288.68 808.629L-692.994 404.314L-647.386 358.707ZM-288.68 0L-55.0578 233.622H-176.359L-288.68 121.301L-401 233.622H-522.301L-288.68 0Z" fill="#fff1f0" />
      </svg>
    </div>

    <div class="relative z-10 w-full max-w-8xl px-6">
      <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        
        <div class="hidden lg:block relative h-[600px] w-full overflow-hidden rounded-[40px] shadow-2xl shadow-slate-400/30">
          
          <div v-for="(img, index) in plantImages" :key="index">
            <transition
              enter-active-class="transition duration-1000 ease-out"
              enter-from-class="opacity-0 scale-105"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-1000 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <img 
                v-if="currentSlide === index"
                :src="img" 
                class="absolute inset-0 h-full w-full object-cover"
                alt="Plant PT MAJ"
              />
            </transition>
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>

          <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            <div 
              v-for="(_, index) in plantImages" 
              :key="index"
              :class="currentSlide === index ? 'w-8 bg-blue-600' : 'w-2 bg-white/50'"
              class="h-2 rounded-full transition-all duration-500 shadow-sm"
            ></div>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <!-- <div class="mb-10 text-center lg:text-left w-full max-w-md">
            <p class="text-[11px] font-bold uppercase tracking-[0.3em] text-red-600 mb-2">Prototype Tugas Akhir</p>
            <h2 class="text-3xl font-black text-slate-800 tracking-tight leading-none">Dashboard Monitoring</h2>
            <p class="text-slate-500 text-sm mt-2">PT. Mekar Armada Jaya</p>
          </div> -->

          <div class="login-box w-full max-w-md rounded-[32px] border border-white/60 bg-white/85 p-10 shadow-2xl shadow-slate-300/40 backdrop-blur-xl transition-all hover:bg-white/90">
            <AuthLogin />
          </div>

          <p class="mt-10 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            PT. Mekar Armada Jaya &copy; 2026
          </p>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  background:
    radial-gradient(circle at top left, rgba(58, 134, 255, 0.12), transparent 40%),
    linear-gradient(160deg, #f8fafc 0%, #eef2f7 60%, #fff1f0 100%);
}

.blur-logo {
  filter: blur(24px);
  opacity: 0.7;
}

/* Memastikan Transisi smooth antar gambar */
.v-enter-active, .v-leave-active {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>