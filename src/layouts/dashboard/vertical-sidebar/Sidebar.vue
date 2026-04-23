<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCustomizerStore } from '@/stores/customizer';
import RecursiveMenu from '@/layouts/dashboard/vertical-sidebar/RecursiveMenu.vue';
import { useAuthStore } from '@/stores/Admin/auth';
import { 
  HomeOutlined, AppstoreOutlined, UserOutlined, SettingOutlined, ToolOutlined, FileTextOutlined, PoweroffOutlined, CheckCircleOutlined,
} from '@ant-design/icons-vue';


const route = useRoute()
const router = useRouter()
const customizer = useCustomizerStore();

const isHovered = ref(false)

// const drawer = ref(true)

function goToDashboard() {
  router.push('/dashboard')
}

function goToProduction() {
  router.push('/production')
}

function goToReport() {
  router.push('/report')
}

function goToUserManagement() {
  router.push('/user-management')
}

const menuItems = {
  directItems: [
    {
      name: 'Dashboard',
      path: '/dashboard',
      meta: { title: 'Dashboard', icon: HomeOutlined }
    }
  ],
  subGroups: {
    Admin: {
      meta: { icon: SettingOutlined },
      directItems: [
        {
          name: 'User Management',
          path: '/admin/user-management',
          meta: { title: 'User Management', icon: UserOutlined }
        },
        {
          name: 'QA Verification',
          path: '/verification/qa',
          meta: { title: 'QA', icon: CheckCircleOutlined }
        },
      ],
      subGroups: {}
    },
    Production: {
      meta: { icon: ToolOutlined },
      directItems: [
        {
          name: 'Production Stamping',
          path: '/production/stamping',
          meta: { title: 'Stamping' }
        },
        {
          name: 'Production Welding',
          path: '/production/welding',
          meta: { title: 'Welding' }
        }
      ],
      subGroups: {}
    },
    Report: {
      meta: { icon: FileTextOutlined },
      directItems: [
        {
          name: 'Report Stamping',
          path: '/report/stamping',
          meta: { title: 'Stamping' }
        },
        {
          name: 'Report Welding',
          path: '/report/welding',
          meta: { title: 'Welding' }
        }
      ],
      subGroups: {}
    },
  }
}
</script>

<template>
  <aside
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :class="[
      'h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 fixed z-40 shadow-sm',

      customizer.mini_sidebar
        ? (isHovered ? 'w-[280px]' : 'w-[80px]')
        : 'w-[280px]'
    ]"
  >
    <div
      @click="goToDashboard"
      class="h-[180px] flex flex-col items-center justify-center cursor-pointer text-white text-center px-4 relative overflow-hidden shrink-0"
      style="
        background:
        linear-gradient(135deg, rgba(15,76,129,0.95), rgba(216,34,41,0.95)),
        url('/src/assets/images/newsidebar.png') center/cover no-repeat;
      "
    >
      <img
        src="/src/assets/images/ico.png"
        alt="Logo"
        class="w-12 h-12 mb-2 drop-shadow-md" 
      />
      <h2 class="text-xl font-black tracking-wider">MAJ</h2>
      <p v-if="!customizer.mini_sidebar || isHovered" class="text-[21px] mt-1 max-w-auto leading-relaxed text-gray-100 font-bold opacity-90">
        Inventory Dashboard
      </p>
    </div>
    
    <div class="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 custom-scrollbar">
      <RecursiveMenu :menu-items="menuItems" :mini="customizer.mini_sidebar" :hovered="isHovered"/>
    </div>

    <div class="p-4">
      <button
        class="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors text-gray-700 hover:bg-gray-50 hover:text-red-600"
      >
        <PoweroffOutlined class="w-5 h-5" />
        <span v-if="!customizer.mini_sidebar || isHovered" class="text-[13px] tracking-wide">
          Logout
        </span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* Custom Scrollbar untuk menu yang panjang */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}
</style>