<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="text-center">

      <!-- Image Wrapper -->
      <div class="relative mx-auto max-w-[720px]">
        <!-- Main Image -->
        <img
          src="/src/assets/images/maintenance/Error404.png"
          alt="404"
          class="mx-auto w-[250px] md:w-[590px]"
        />

        <!-- Decorative Image -->
        <img
          src="/src/assets/images/maintenance/TwoCone.png"
          alt="decor"
          class="absolute top-[40px] right-[-20%] w-[120px] md:w-[350px] md:right-[-50%]"
        />
      </div>

      <!-- Title -->
      <h1 class="text-4xl md:text-6xl font-bold mt-10 text-gray-800">
        Page Not Found
      </h1>

      <!-- Description -->
      <p class="text-gray-500 mt-4 text-sm md:text-base">
        The page you are looking was moved, removed,<br />
        renamed, or might never exist!
      </p>

      <!-- Button -->
      <button
        @click="goHome"
        class="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Back To Dashboard
      </button>

    </div>
  </div>
</template>