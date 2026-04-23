<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

const openGroups = ref<Record<string, boolean>>({})

const props = defineProps<{
  menuItems: any
  parentPath?: string
  depth?: number
  mini?: boolean
  hovered?: boolean
}>()

const depth = props.depth ?? 0

// Mengecek apakah menu item merupakan halaman yang sedang aktif
const isItemActive = (path: string) => route.path === path

// Navigasi
const handleItemClick = (item: any) => {
  router.push(item.path)
}

// Buka/tutup grup
const toggleGroup = (groupName: string) => {
  openGroups.value[groupName] = !openGroups.value[groupName]
}

// Buat ID unik untuk setiap grup
const createUniqueKey = (groupName: string) => {
  return props.parentPath ? `${props.parentPath}-${groupName}` : groupName
}

// Cek apakah ada child di dalam grup ini yang sedang aktif (agar parent tetap terbuka)
const isGroupActive = (subGroup: any): boolean => {
  if (subGroup.directItems) {
    for (const item of subGroup.directItems) {
      if (route.path === item.path) return true
    }
  }
  if (subGroup.subGroups) {
    return Object.values(subGroup.subGroups).some((sub: any) => isGroupActive(sub))
  }
  return false
}

// Auto-open grup jika ada child yang aktif
onMounted(() => {
  if (props.menuItems.subGroups) {
    for (const [groupName, subGroup] of Object.entries(props.menuItems.subGroups)) {
      if (isGroupActive(subGroup)) {
        openGroups.value[groupName] = true
      }
    }
  }
})
</script>

<template>
  <div class="space-y-1">
    <div v-for="item in menuItems.directItems" :key="item.name">
      <button
        @click="handleItemClick(item)"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
        :class="[
          isItemActive(item.path)
            ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600 pl-2.5'
            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
        ]"
      >
        <div v-if="isItemActive(item.path)" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-blue-600 rounded-r-md"></div>

        <div v-if="depth > 0 && !item.meta?.icon" 
          class="w-1.5 h-1.5 rounded-full ml-1 transition-colors"
          :class="isItemActive(item.path) ? 'bg-blue-600' : 'bg-gray-300 group-hover:bg-blue-400'">
        </div>

        <component 
          v-if="item.meta?.icon" 
          :is="item.meta.icon" 
          class="text-lg transition-transform group-hover:scale-110" 
          :class="isItemActive(item.path) ? 'text-blue-600' : 'text-gray-400'"
        />

        <span 
          v-if="!mini || hovered" 
          class="text-[13px] tracking-wide"
        >
          {{ item.meta?.title || item.name }}
        </span>
      </button>
    </div>

    <div v-for="(subGroup, groupName) in menuItems.subGroups" :key="createUniqueKey(String(groupName))">
      
      <button
        @click="toggleGroup(String(groupName))"
        class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors group mt-1"
        :class="[
          isGroupActive(subGroup) ? 'text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
        ]"
      >
        <div class="flex items-center gap-3">
          <component 
            v-if="subGroup.meta?.icon" 
            :is="subGroup.meta.icon" 
            class="text-lg"
            :class="isGroupActive(subGroup) ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'"
          />
          <span 
            v-if="!mini || hovered"
            class="text-[13px] tracking-wide"
          >
            {{ groupName }}
          </span>
        </div>

        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="w-4 h-4 transition-transform duration-300"
          :class="[
            openGroups[String(groupName)] ? 'rotate-90 text-blue-600' : 'text-gray-400',
            isGroupActive(subGroup) && !openGroups[String(groupName)] ? 'text-blue-600' : ''
          ]"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div 
        v-show="openGroups[String(groupName)]" 
        class="mt-1 relative pl-4 ml-3"
      >
        <div class="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
        
        <RecursiveMenu
          :menu-items="subGroup"
          :parent-path="createUniqueKey(String(groupName))"
          :depth="depth + 1"
        />
      </div>

    </div>
  </div>
</template>

<style>
.menu-group {
  position: relative;
}

/* defaults (Admin, Stamp, Etc.) */
.custom-sidebar, :root {
  --pad-header: 14px;
  --pad-sub:   32px;
  --pad-item:  58px;
  --prepend-gap: 8px;

  --dot-shift: -6px;
  --sub1-shift: 2px;
  --sub2-shift: -12px;
}

/* role-based padding */
/* .v-list-item__prepend { margin-right: var(--prepend-gap) !important; } */
.v-list-item.is-header    { padding-inline-start: var(--pad-header) !important; }
.v-list-item.is-subheader { padding-inline-start: var(--pad-sub)    !important; }
.v-list-item.is-item      { padding-inline-start: var(--pad-item)   !important; }

/* Prepend gap for headers and subheaders */
.v-list-item.is-header .v-list-item__prepend,
.v-list-item.is-subheader .v-list-item__prepend {
  margin-right: var(--prepend-gap) !important; 
}

.v-list-item.is-item .v-list-item__spacer {
  width: 8px !important;
}

 .v-list-item.is-subheader.depth-1 .prepend-wrap {
  margin-left: -10px;
}

.v-list-item.is-subheader.depth-2 .prepend-wrap {
  margin-left: 0 !important;
}

.prepend-wrap{ display:flex; align-items:center; }
.prepend-wrap.no-icon { gap: 0; }
.v-list-item.is-subheader .prepend-wrap.no-icon { --prepend-gap: 4px; }

.item-dot{
  --dot-size: 4px;
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
  background: #e0e0e0;
  margin-right: 8px;
  transform: translateX(var(--dot-shift));
}
.sub-line {
  width:8px;
  height:1.5px;
  background: rgba(0,0,0,.12);
  margin-right:8px;
}
.depth-1 .sub-line{ transform: translateX(var(--sub1-shift)); }
.depth-2 .sub-line{ transform: translateX(var(--sub2-shift)); }

/* logistic */
.custom-sidebar .logistic-scope{
  --pad-sub: 36px;
  --pad-sub2: 46px;
  --pad-item: 78px;

  --dot-shift: -4px;
  --sub1-shift: -4px;
  --sub2-shift: 4px;
}

.custom-sidebar .logistic-scope .depth-1 .v-list-item.is-subheader {
  --pad-sub: 36px;
}

.custom-sidebar .logistic-scope .depth-2 .v-list-item.is-subheader {
  --pad-sub: 46px;
}

.custom-sidebar .logistic-scope .v-list-item.is-subheader {
  padding-left: var(--pad-sub);
}

/* Default Color*/
.v-list-item {
  color: #666666;
}

.v-list-item .v-icon {
  color: #666666;
}

/* Dot ACTIVE*/
.item-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #e0e0e0;
  margin-right: 8px;
  transform: translateX(var(--dot-shift));
}

.item-dot.active-dot {
  background-color: #303F9F !important;
}

/* Horizontal LINE ACTIVE */
/* .v-list-item.is-subheader:active .sub-line,
.v-list-item.is-subheader:focus .sub-line {
  background-color: #303F9F !important;
} */

.v-list-item.is-subheader:not(.v-list-item--active) .sub-line {
  background-color: rgba(0, 0, 0, 0.12) !important; /* Grey color when not active */
}

.v-list-item.is-subheader.active .sub-line {
  background-color: #303F9F !important; /* Active Horizontal Line Color */
}

.v-list-item.is-subheader.v-list-item--active .sub-line {
  background-color: #303F9F !important; /* Active Horizontal Line Color */
}

.sub-line {
  width: 8px;
  height: 1.5px;
  background: rgba(0, 0, 0, .12);
  margin-right: 8px;
  transition: background-color 0.3s ease;
}

/* *** */
.v-list-group {
  transition: all 0.3s ease;
}

.v-list-group.depth-0 > .v-list-group__header::before {
  transition: all 0.3s ease-in-out;
}

.item-icon{
  margin-left: 0;
}

.v-list-item.v-list-item--active:hover {
  transform: none;
  box-shadow: none;
}

/* Sub line */
/* .prepend-wrap{
  display:flex;
  align-items:center;
} */

.sub-icon{ margin-left: 0; }

/* Active Vertical Line */
.v-list-group.depth-1 > .v-list-group__items > .v-list-item.v-list-group__header::before,
.v-list-group.depth-2 > .v-list-group__items > .v-list-item.v-list-group__header::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 0;
  bottom: 0;
  width: 8px;
  background-color: rgba(0, 0, 0, 0.12);
  z-index: 2;
}

/* Change the vertical line color when the subheader is active (clicked) */
.v-list-group.depth-1 .v-list-item.v-list-group__header.v-list-item--active::before,
.v-list-group.depth-2 .v-list-item.v-list-group__header.v-list-item--active::before {
  background-color: #303F9F !important;
}

/* Transition effect for both lines (vertical and horizontal) */
.v-list-group.depth-1 > .v-list-group__items > .v-list-item.v-list-group__header::before,
.v-list-group.depth-2 > .v-list-group__items > .v-list-item.v-list-group__header::before,
.v-list-group.depth-1 > .v-list-group__items > .v-list-item.v-list-group__header::after,
.v-list-group.depth-2 > .v-list-group__items > .v-list-item.v-list-group__header::after {
  transition: background-color 0.3s ease-in-out;
}

/* Garis Vertical Active color*/
.menu-group.depth-1.v-list-group--open::after {
  content: '';
  position: absolute;
  top: 0;
  left: 20px;
  width: 1.3px;
  background-color: #303F9F;
  z-index: 3;
  height: calc(100% - 5px);
}

.menu-group.depth-2.v-list-group--open::after {
  content: '';
  position: absolute;
  top: 0;
  left: 39px;
  width: 2px;
  background-color: #303F9F;
  z-index: 3;
  height: calc(100% - 5px);
}

/* Garis Vertical */
.menu-group.depth-0.v-list-group--open::before,
.menu-group.depth-1.v-list-group--open::before,
.menu-group.depth-2.v-list-group--open::before {
  content: '';
  position: absolute;
  top: 48px;
  bottom: 0;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.12);
  z-index: 1;
}

.menu-group.depth-0.v-list-group--open::before {
  left: 20px;
}

.menu-group.depth-1.v-list-group--open::before {
  left: 39px;
}

.menu-group.depth-2.v-list-group--open::before {
  left: 62px;
}

/* Background Color */
.v-list-item--active[href] {
  background-color: transparent !important;
}

.v-list-item--active[href] .v-list-item-title,
.v-list-item--active[href] .v-icon {
  color: #303F9F !important;
  font-weight: 700 !important;
}

.v-list-item--active[href]::before {
  background-color: #1a237e !important;
}

.v-list-group--active > .v-list-group__header > .v-list-item {
    background-color: transparent !important;
    color: inherit !important;
}
.v-list-group--active > .v-list-group__header > .v-list-item .v-list-item-title,
.v-list-group--active > .v-list-group__header > .v-list-item .v-icon {
    color: inherit !important;
    font-weight: normal !important;
}

.v-list-item.active-top-level-header,
.v-list-group.depth-0 .v-list-item.v-list-group__header.v-list-item--active {
  background-color: #1a237e !important;
  color: #fff !important;
}

.v-list-item.active-top-level-header .v-list-item-title,
.v-list-item.active-top-level-header .v-icon,
.v-list-group.depth-0 .v-list-item.v-list-group__header.v-list-item--active .v-list-item-title,
.v-list-group.depth-0 .v-list-item.v-list-group__header.v-list-item--active .v-icon {
  color: #fff !important;
}

.v-list-group.depth-1 .v-list-item.v-list-group__header.v-list-item--active,
.v-list-group.depth-2 .v-list-item.v-list-group__header.v-list-item--active {
    color: inherit !important;
    background-color: transparent !important;
}

.v-list-group .v-list-item.v-list-group__header {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}

.v-list-item {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}

.v-list-item:hover {
  color: #1a237e !important;
  transform: translateX(4px);
  box-shadow: none;
}

.v-list-group.depth-1 .v-list-item.v-list-group__header.v-list-item--active .v-list-item-title,
.v-list-group.depth-1 .v-list-item.v-list-group__header.v-list-item--active .v-icon,
.v-list-group.depth-2 .v-list-item.v-list-group__header.v-list-item--active .v-list-item-title,
.v-list-group.depth-2 .v-list-item.v-list-group__header.v-list-item--active .v-icon {
  color: inherit !important;
  font-weight: normal !important;
}

/* Arrow */
.v-list-group .v-list-item__append .v-icon {
  transform: rotate(-90deg) !important;
  transition: transform 0.2s ease-in-out;
}
.v-list-group--open > .v-list-group__header > .v-list-item__append .v-icon {
  transform: rotate(-180deg) !important;
}
</style>