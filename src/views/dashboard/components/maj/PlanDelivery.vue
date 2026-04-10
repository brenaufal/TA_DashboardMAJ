<template>
  <div class="w-full p-4 space-y-4">
    
    <!-- Header + Tabs -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      
      <!-- Title -->
      <h2 class="text-xl font-semibold">
        Plan Delivery
      </h2>

      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 justify-end">
        <button
          v-for="item in tabs"
          :key="item.value"
          @click="tab = item.value"
          :class="[
            'px-3 py-1 rounded-md border text-sm transition',
            tab === item.value
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
          ]"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <!-- Card -->
    <div class="border rounded-xl p-4 bg-white shadow-sm">
      
      <!-- Title -->
      <h2 class="text-center font-semibold mb-4">
        Plan Delivery {{ modelTitle }} {{ currentMonth }} {{ currentYear }}
      </h2>

      <!-- Chart -->
      <div class="w-full">
        <PlanDeliveryChart :model="tab" />
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PlanDeliveryChart from '@/views/dashboard/components/chart/PlanDeliveryChart.vue';

const tab = ref('ADM_SAP');

const modelTitle = computed(() => tab.value);
const currentMonth = computed(() => new Date().toLocaleString('default', { month: 'long' }));
const currentYear = computed(() => new Date().toLocaleString('default', { year: 'numeric' }));
</script>

<style scoped>
.v-card {
  background-color: white;
}

.tabBtn {
  gap: 12px;
  margin-top: 14px;
}
</style>
