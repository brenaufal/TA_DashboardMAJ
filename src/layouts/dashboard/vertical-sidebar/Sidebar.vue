<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const drawer = ref(true)

function goToDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <!-- Sidebar -->
  <aside
    class="w-[280px] h-screen bg-white border-r flex flex-col"
  >
    <!-- Header -->
    <div
      @click="goToDashboard"
      class="h-[220px] flex flex-col items-center justify-center cursor-pointer text-white text-center px-4"
      style="
        background:
        linear-gradient(180deg, rgba(15,76,129,0.95), rgba(216,34,41,0.92)),
        url('/src/assets/images/newsidebar.png') center/cover no-repeat;
      "
    >
      <img
        src="/src/assets/images/ico.png"
        alt="Logo"
        class="w-14 h-14 mb-3"
      />

      <h2 class="text-xl font-black">MAJ</h2>

      <p class="text-xs mt-1 max-w-[180px] leading-snug">
        Dashboard Monitoring Produksi dan Delivery
      </p>
    </div>

    <!-- Menu -->
    <div class="flex-1 px-3 py-4">
      <p class="text-xs text-gray-400 mb-2">Menu Utama</p>

      <ul class="space-y-2">
        <li>
          <button
            @click="goToDashboard"
            class="w-full text-left p-3 rounded-xl border transition flex items-start gap-2"
            :class="route.path === '/dashboard'
              ? 'bg-blue-50 border-blue-500'
              : 'bg-white border-gray-200 hover:bg-gray-50'"
          >
            <!-- Bullet -->
             <div>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
              </svg>
             </div>
            <div class="w-2 h-2 mt-2 rounded-full bg-gradient-to-br from-blue-600 to-red-500"></div>

            <!-- Text -->
            <div>
              <p class="font-medium text-sm">Home</p>
              <p class="text-xs text-gray-400">
                Ringkasan delivery dan plan
              </p>
            </div>
          </button>
        </li>
      </ul>

      <!-- Info Card -->
      <!-- <div class="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <p class="text-sm font-semibold mb-1">
          Prototype Tugas Akhir
        </p>
        <p class="text-xs text-gray-600">
          Layout ini memakai folder <b>layouts</b> untuk sidebar, header, dan dashboard shell.
        </p>
      </div> -->
    </div>
  </aside>
</template>