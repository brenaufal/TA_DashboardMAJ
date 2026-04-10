<template>
  <div class="w-full px-4">
    <div class="mb-6">
      <DashboardDelivery />
    </div>

    <div class="mb-6">
      <PlanDelivery />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import DashboardDelivery from '@/views/dashboard/components/maj/DashboardDelivery.vue'
import PlanDelivery from '@/views/dashboard/components/maj/PlanDelivery.vue'
import { initFlowbite } from 'flowbite'

onMounted(() => {
  initFlowbite()
})
</script>