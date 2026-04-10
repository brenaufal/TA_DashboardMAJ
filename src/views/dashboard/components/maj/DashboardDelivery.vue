<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Dashboard Delivery</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(item, i) in dashboardDeliveryItems"
        :key="i"
        @click="goTo(item.link)"
        class="p-4 border rounded-xl bg-white hover:scale-105 transition cursor-pointer"
      >
        <div class="flex justify-between">
          <!-- LEFT -->
          <div>
            <h6 class="text-lg text-gray-500 mb-1">
              {{ item.title }}
            </h6>

            <h4
              class="text-4xl font-bold"
              :class="item.diff < 0 ? 'text-red-500' : 'text-green-600'"
            >
              {{ fmt(item.diff) }}
              <span class="text-sm text-gray-400">Items</span>
            </h4>

            <div class="mt-2 text-sm text-gray-500">
              <p>Plan: <span class="text-green-500">{{ fmt(item.plan) }}</span></p>
              <p>Actual: <span class="text-green-500">{{ fmt(item.actual) }}</span></p>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="flex flex-col items-center gap-2">
            <img
              :src="getImage(item.src)"
              class="w-16 h-16 object-contain"
            />

            <span
              class="px-2 py-1 text-sm rounded border"
              :style="{
                color: getTrendColor(item),
                borderColor: getTrendColor(item),
                background: getTrendBg(item)
              }"
            >
              {{ item.pct }}%
            </span>

            <p class="text-xs text-gray-400">
              {{ dateToday }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RiseOutlined, FallOutlined } from '@ant-design/icons-vue'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const dashboardDeliveryItems = ref([])

    // Fetch from backend
    const loadDashboardDelivery = async () => {
      // try {
        // const res = await fetch()
        // (`http://localhost:8080/api/dashboard/cust`)
        // const data = await res.json()

        // Map backend JSON into frontend structure
        dashboardDeliveryItems.value = [
          {
            src: 'customer/adm.png',
            title: 'ADM SAP',
            link: 'irm-inhouse-rundown',
            customClass: 'wide-image',
            plan: 120,
            actual: 140,
            diff: 20,
            pct: 15,
            //...data['ADM SAP']
          },
          {
            src: 'customer/adm.png',
            title: 'ADM KAP', 
            link: 'irm-outhouse-rundown', 
            customClass: 'wide-image', 
            //...data['ADM KAP']
            plan: 120,
            actual: 140,
            diff: 20,
            pct: 15,
          },
          {
            src: 'customer/hmmi.png',
            title: 'HMMI',
            link: 'wip-rundown-inhouse',
            //...data['HMMI']
            plan: 120,
            actual: 140,
            diff: 20,
            pct: 15,
          },
          {
            src: 'customer/mkm.png',
            title: 'MKM',
            link: 'wip-rundown-outhouse',
            // ...data['MKM']
            plan: 120,
            actual: 140,
            diff: 20,
            pct: 15,
          },
          {
            src: 'customer/mmki.png',
            title: 'MMKI',
            link: 'ifp-inhouse-rundown',
            // ...data['MMKI']
            plan: 120,
            actual: 140,
            diff: 20,
            pct: 15,
          },
          {
            src: 'customer/tmmin.png',
            title: 'TMMIN',
            link: 'ifp-inhouse-rundown',
            // ...data['TMMIN']
            plan: 120,
            actual: 140,
            diff: 20,
            pct: 15,
          }
        ]
    }

    onMounted(loadDashboardDelivery)

    // Helpers
    const fmt = v => (v === null || v === undefined ? '-' : Number(v).toLocaleString('id-ID'))
    const getImage = src => `${import.meta.env.BASE_URL}src/assets/${src}`
    const getTrendIcon = item => (item.diff < 0 ? 'FallOutlined' : 'RiseOutlined')
    const getTrendColor = item => (item.diff < 0 ? '#FF6363' : '#06923E')
    const getTrendBg = item => (item.diff < 0 ? '#FFE5E5' : '#E5F7EB')

    const dateToday = new Date().toLocaleDateString('id-ID')

    return {
      dashboardDeliveryItems,
      fmt,
      getImage,
      getTrendIcon,
      getTrendColor,
      getTrendBg,
      dateToday
    }
  },
  components: {
    RiseOutlined,
    FallOutlined
  }
}
</script>

<style scoped>
.center-chip {
  position: absolute;
  left: 85%;
  transform: translateX(-50%);
  bottom: 40px; /* Adjust the value to control the space between the image and the chip */
}

.square-card {
  width: 100%;
  min-height: 160px;
  border-radius: 12px;
  transition: transform 0.25s ease;
  background-color: #ffffff;
}

.square-card:hover {
  transform: scale(1.05);
}

.card-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px;
  grid-template-areas:
    "left right"
    "desc desc";
  grid-template-rows: 120px auto;
  column-gap: 14px;
  align-items: start;
}

.left {
  grid-area: left;
  display: flex;
  flex-direction: column;
}

.right {
  grid-area: right;
  justify-self: end;
  align-self: start;
}

.desc {
  grid-area: desc;
}

.desc-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  font-size: 1.5rem;
}

.left .text-h5 {
  line-height: 1.2;
  margin-bottom: 4px !important;
}

.left .text-h2 {
  line-height: 1.2;
  margin-bottom: 6px !important;
}

.wide-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.d-flex {
  display: flex;
  align-items: center;
  gap: 12px;
}
.tanggal {
  margin-top: 26px;
}
</style>