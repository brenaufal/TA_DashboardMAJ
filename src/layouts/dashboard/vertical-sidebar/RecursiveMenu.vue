<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

const activeItem = ref<string>('')
const clickedSubheader = ref<string>('')

// 👇 NEW (for collapse)
const openGroups = ref<Record<string, boolean>>({})

const props = defineProps<{
  menuItems: any
  parentPath?: string
  depth?: number
  branchClass?: string
}>()

const depth = props.depth ?? 0
const branchClass = props.branchClass ?? ''

const setActiveItem = (itemName: string) => {
  activeItem.value = itemName
}

const handleItemClick = (item: any) => {
  setActiveItem(item.name)
  router.push(item.path)
}

const toggleGroup = (groupName: string) => {
  openGroups.value[groupName] = !openGroups.value[groupName]
}

const checkActiveOnRoute = () => {
  const activePath = route.path
  for (const item of props.menuItems.directItems) {
    if (item.path === activePath) {
      activeItem.value = item.name
    }
  }
}

onMounted(() => {
  checkActiveOnRoute()
})

const createUniqueKey = (groupName: string) => {
  return props.parentPath
    ? `${props.parentPath}-${groupName}`
    : groupName
}

const isNodeActive = (node: any): boolean => {
  for (const item of node.directItems) {
    if (item.path === route.path) return true
  }

  return Object.values(node.subGroups).some((sub: any) =>
    isNodeActive(sub)
  )
}
</script>

<template>
  <!-- DIRECT ITEMS -->
  <div v-for="item in menuItems.directItems" :key="item.name">
    <button
      @click="handleItemClick(item)"
      class="w-full flex items-center gap-2 px-4 py-2 text-left rounded-lg transition"
      :class="[
        branchClass,
        activeItem === item.name
          ? 'text-indigo-700 font-semibold'
          : 'text-gray-600 hover:text-indigo-600 hover:translate-x-1'
      ]"
      :style="{ fontSize: `${14 - depth * 0.5}px` }"
    >
      <!-- dot -->
      <span
        v-if="depth > 1"
        class="w-1 h-1 rounded-full"
        :class="activeItem === item.name ? 'bg-indigo-700' : 'bg-gray-300'"
      ></span>

      <!-- icon -->
      <span v-if="item.meta?.icon" class="text-sm">
        {{ item.meta.icon }}
      </span>

      {{ item.meta.title }}
    </button>
  </div>

  <!-- SUB GROUP -->
  <div
    v-for="(subGroup, groupName) in menuItems.subGroups"
    :key="createUniqueKey(groupName)"
    class="ml-2"
  >
    <!-- HEADER -->
    <button
      @click="toggleGroup(groupName)"
      class="w-full flex items-center justify-between px-4 py-2 rounded-lg transition"
      :class="[
        depth === 0 ? 'font-semibold' : '',
        isNodeActive(subGroup)
          ? 'text-indigo-700'
          : 'text-gray-600 hover:text-indigo-600'
      ]"
      :style="{ fontSize: `${14 - depth * 0.5}px` }"
    >
      <div class="flex items-center gap-2">
        <!-- optional icon -->
        <span v-if="menuItems.subGroupIcons?.[groupName]">
          {{ menuItems.subGroupIcons[groupName] }}
        </span>

        {{ groupName }}
      </div>

      <!-- arrow -->
      <span
        class="transition-transform"
        :class="openGroups[groupName] ? 'rotate-90' : ''"
      >
        ▶
      </span>
    </button>

    <!-- CHILDREN -->
    <div v-show="openGroups[groupName]" class="ml-3">
      <RecursiveMenu
        :menu-items="subGroup"
        :parent-path="createUniqueKey(groupName)"
        :depth="depth + 1"
        :branch-class="branchClass"
      />
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