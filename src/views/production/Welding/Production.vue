<script setup lang="ts">
import { ref, onMounted, shallowRef, computed } from "vue";
import { useNotificationStore } from "@/stores/notification";
import { useProductionStore } from "@/stores/Production/Production";
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'

const productionStore = useProductionStore();
const notification = useNotificationStore();

// ================= STATE =================
const page = ref({ title: "Production Stamping" });
const breadcrumbs = shallowRef([
  {
    title: 'Production',
    disabled: false,
    href: '#'
  },
  {
    title: 'Stamping',
    disabled: true,
    href: '#'
  }
]);

const currentPage = ref(1);
const itemsPerPage = ref(5);
const rowsPerPageOptions = [5, 10, 25, 50];

const totalPages = computed(() => {
  const total = Math.ceil(productionStore.productions.length / itemsPerPage.value);
  return total > 0 ? total : 1;
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredData.value.slice(start, start + itemsPerPage.value)
})

const filteredData = computed(() => {
  if (!Array.isArray(productionStore.productions)) return [];

  return productionStore.productions.filter((item: any) => {
    return (
      String(item.tanggal || '').includes(filter.value.tanggal) &&
      String(item.shift).includes(filter.value.shift) &&
      (!filter.value.line || item.line_id == filter.value.line) &&
      (!filter.value.part || item.part_id == filter.value.part) &&
      String(item.plan ?? '').includes(filter.value.plan) &&
      String(item.actual ?? '').includes(filter.value.actual) &&
      String(item.status ?? '').toLowerCase().includes(filter.value.status.toLowerCase()) &&
      String(item.pcs ?? '').includes(filter.value.pcs) &&
      String(item.qa_status ?? '').toLowerCase().includes(filter.value.qa_status.toLowerCase())
    )
  })
})

const loadData = async () => {
  await fetchProductions({
    category_id: 2 // welding
  })
  currentPage.value = 1;
};

const getLineName = (id: any) => {
  return lineOptions.find(l => l.id == id)?.name || '-'
}

const getPartName = (id: any) => {
  return partOptions.find(p => p.id == id)?.name || '-'
}

const lineOptions = [
  { id: 1, name: "Line CO2" },
  { id: 2, name: "Line Spot" },
  { id: 3, name: "Line Robot" },
]

const partOptions = [
  { id: 1, name: "Part E" },
  { id: 2, name: "Part F" },
  { id: 3, name: "Part G" },
  { id: 4, name: "Part H" }
]

const form = ref({
  tanggal: '',
  shift: '',
  category_id: 2,
  line_id: '',
  part_id: '',
  plan: 0,
  actual: 0,
  pcs: 0,
  status: ''
})

const filter = ref({
  tanggal: '',
  shift: '',
  line: '',
  part: '',
  plan: '',
  actual: '',
  status: '',
  pcs: '',
  qa_status: '',
})

const showEditModal = ref(false)

const editForm = ref({
  id: null as number | null,
  tanggal: '',
  shift: '',
  line_id: '',
  part_id: '',
  plan: 0,
  actual: 0,
  pcs: 0,
  status: ''
})

const {
  fetchProductions,
  addProduction,
  updateProduction,
  deleteProduction,
} = productionStore

// ================= METHODS =================

const openEditModal = (item: any) => {
  editForm.value = {
    id: item.id,
    tanggal: item.tanggal,
    shift: String(item.shift),
    line_id: item.line_id,
    part_id: item.part_id,
    plan: item.plan,
    actual: item.actual,
    pcs: item.pcs,
    status: item.status
  }

  showEditModal.value = true
}

const updateData = async () => {
  try {
    notification.loading = true

    if (!editForm.value.id) {
      throw new Error("ID tidak ditemukan")
    }

    await updateProduction(editForm.value)

    showEditModal.value = false

  } catch (e) {
    console.error(e)
  } finally {
    notification.loading = false
  }
}

const previewStatus = computed(() => {
  const plan = Number(form.value.plan) || 0
  const actual = Number(form.value.actual) || 0

  if (actual > plan) return "Over Target"
  if (actual === plan) return "Achieved"
  return "Not Achieved"
})

const submitForm = async () => {
  if (!form.value.tanggal || !form.value.line_id || !form.value.part_id) {
    notification.showAlertWarning("Data belum lengkap!");
    return;
  }

  try {
    notification.loading = true

    await addProduction(form.value)

    // reset form
    form.value = {
      tanggal: "",
      shift: "",
      category_id: 2,
      line_id: "",
      part_id: "",
      plan: 0,
      actual: 0,
      pcs: 0,
      status: ""
    };

  } catch (e) {
    console.error(e);
  } finally {
    notification.loading = false;
  }
};

const deleteData = async (id: number) => {
  if (notification.showConfirm("Hapus data ini?")) {
    await deleteProduction(id);
    
    if (paginatedData.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" class="mb-7"></BaseBreadcrumb>
  <div class="p-6 space-y-6">

    <!-- TITLE -->
    <!-- <h1 class="text-2xl font-bold">Production</h1> -->

    <!-- ================= FORM INPUT ================= -->
    <div class="mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
  
  <div class="flex items-center gap-3 border-b border-gray-100 pb-4">
    <div class="bg-blue-50 p-2.5 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    </div>
    <div>
      <h2 class="font-bold text-xl text-gray-800">Input Produksi</h2>
      <p class="text-sm text-gray-500">Catat rencana dan hasil produksi harian</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
    
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Tanggal</label>
      <input v-model="form.tanggal" type="date" 
        class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-700" />
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Shift</label>
      <select v-model="form.shift" 
        class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-700">
        <option value="" disabled>Pilih Shift...</option>
        <option value="1">Shift 1 (Pagi)</option>
        <option value="2">Shift 2 (Malam)</option>
      </select>
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Line</label>
      <select v-model.number="form.line_id"
        class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-700">
        <option value="" disabled>Pilih Line...</option>
        <option v-for="l in lineOptions" :key="l.id" :value="l.id">
          {{ l.name }}
        </option>
      </select>
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Part</label>
      <select v-model.number="form.part_id"
        class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-700">
        <option value="" disabled>Pilih Part...</option>
        <option v-for="p in partOptions" :key="p.id" :value="p.id">
          {{ p.name }}
        </option>
      </select>
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Plan</label>
      <input v-model.number="form.plan" type="number" placeholder="0" min="0"
        class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-gray-700" />
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Actual</label>
      <input v-model.number="form.actual" type="number" placeholder="0" min="0"
        class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-semibold text-emerald-600" />
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Status</label>
      <input
        :value="previewStatus"
        disabled
        class="w-full px-4 py-3 rounded-xl bg-gray-100 border text-gray-700 font-semibold"
      />
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">PCS</label>
      <div class="relative">
        <input
      :value="form.actual"
      disabled
      class="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-semibold text-gray-700"
    />
          
        <span class="absolute right-4 top-3.5 text-sm text-gray-400 font-medium">pcs</span>
      </div>
    </div>

  </div>

  <div class="pt-4 flex justify-end">
    <button @click="submitForm"
      class="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
      <span>Simpan Data</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</div>

    <!-- ================= FILTER ================= -->
    <div class="mx-auto bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-end gap-4">
      
      <div class="space-y-1.5 flex-1">
        <label class="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Tanggal
        </label>
        <input v-model="filter.tanggal" type="date" 
          class="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-gray-700" />
      </div>

      <div class="space-y-1.5 flex-1">
        <label class="text-sm font-medium text-gray-700">Line
          
        </label>
        <select v-model="filter.line" 
          class="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-700">
          <option value="">Semua Line</option>
          <option value="1">Line CO2</option>
          <option value="2">Line Spot</option>
          <option value="3">Line Robot</option>
        </select>
      </div>
      
      <div class="space-y-1.5 flex-1">
        <label class="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Shift
        </label>
        <select v-model="filter.shift" 
          class="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-gray-700">
          <option value="">Semua Shift</option>
          <option value="1">Shift 1 (Pagi)</option>
          <option value="2">Shift 2 (Malam)</option>
        </select>
      </div>
        
      <!-- <div class="flex gap-2 w-full md:w-auto pt-2 md:pt-0">
        <button @click="loadData"
          class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm shadow-emerald-600/20 transition-all active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Terapkan Filter</span>
        </button>
      </div> -->

    </div>

    <!-- ================= TABLE ================= -->
    <div class="mx-auto bg-white rounded-3xl shadow-sm border border-gray-600 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <!-- HEADER -->
            <tr class="bg-gray-50/50">
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tanggal</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Shift</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Line</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Part</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Plan</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actual</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">QA Status</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">PCS</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th>
            </tr>

            <!-- 🔍 SEARCH ROW -->
            <tr class="bg-gray-50 border-b">
              <th class="px-4 py-2">
                <input v-model="filter.tanggal" class="input-table" placeholder="Cari..." />
              </th>
              <th class="px-4 py-2">
                <input v-model="filter.shift" class="input-table" placeholder="Shift..." />
              </th>
              <th class="px-4 py-2">
                <input v-model="filter.line" class="input-table" placeholder="Line..." />
              </th>
              <th class="px-4 py-2">
                <input v-model="filter.part" class="input-table" placeholder="Part..." />
              </th>
              <th class="px-4 py-2">
                <input v-model="filter.plan" class="input-table" placeholder="Plan..." />
              </th>
              <th class="px-4 py-2">
                <input v-model="filter.actual" class="input-table" placeholder="Actual..." />
              </th>
              <th class="px-4 py-2">
                <input v-model="filter.status" class="input-table" placeholder="Status..." />
              </th>
              <th class="px-4 py-2">
                <input v-model="filter.qa_status" class="input-table" placeholder="QA Status..." />
              </th>
              <th class="px-4 py-2">
                <input v-model="filter.pcs" class="input-table" placeholder="PCS..." />
              </th>
              <th></th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-600">
            <tr
              v-for="item in paginatedData"
              :key="item.id"
              class="hover:bg-blue-50/30 transition group"
            >
              <!-- Tanggal -->
              <td class="px-6 py-4 text-sm font-medium text-gray-700">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  <span class="text-sm font-semibold text-gray-700">{{ item.tanggal }}</span>
                </div>
              </td>

              <!-- Shift -->
              <td class="px-6 py-4">
                <span
                  :class="item.shift == 1 ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'"
                  class="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase"
                >
                  Shift {{ item.shift }}
                </span>
              </td>

              <!-- Line -->
              <td class="px-6 py-4 text-sm font-bold text-gray-800">
                {{ getLineName(item.line_id) }}
              </td>

              <!-- Part -->
              <td class="px-6 py-4 text-sm">
                {{ getPartName(item.part_id) }}
              </td>

              <!-- Plan -->
              <td class="px-6 py-4 text-center">
                {{ item.plan ?? '-' }}
              </td>

              <!-- Actual -->
              <td class="px-6 py-4 text-center">
                {{ item.actual ?? '-' }}
              </td>

              <!-- Status -->
              <td class="text-center">
                <span
                  :class="{
                    'text-green-600': item.status === 'Achieved',
                    'text-blue-600': item.status === 'Over Target',
                    'text-red-500': item.status === 'Not Achieved'
                  }"
                  class="font-bold"
                >
                  {{ item.status }}
                </span>
              </td>

              <!-- Status QA -->
              <td class="px-6 py-4 text-center">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-700': item.qa_status === 'pending',
                    'bg-green-100 text-green-700': item.qa_status === 'approved',
                    'bg-red-100 text-red-700': item.qa_status === 'rejected'
                  }"
                >
                  {{ item.qa_status || 'pending' }}
                </span>
              </td>

              <!-- PCS -->
              <td class="px-6 py-4 text-center font-bold">
                {{ item.pcs }}
              </td>

              <!-- Aksi -->
              <td class="px-6 py-4 text-right">
                <button @click="openEditModal(item)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="deleteData(item.id)"
                  :disabled="item.qa_status === 'approved'"
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Hapus"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>

            <tr v-if="paginatedData.length === 0">
              <td colspan="5" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="bg-gray-50 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p class="text-gray-400 font-medium">Belum ada data laporan untuk periode ini</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500 font-medium">Tampilkan:</span>
          <select v-model="itemsPerPage" @change="currentPage = 1"
            class="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option v-for="opt in rowsPerPageOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500 mr-2">
            Halaman <span class="font-bold text-gray-800">{{ currentPage }}</span> dari <span class="font-bold text-gray-800">{{ totalPages || 1 }}</span>
          </span>
          
          <div class="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-r border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              @click="currentPage++" 
              :disabled="currentPage >= totalPages"
              class="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- ================= EDIT MODAL ================= -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden">

        <!-- HEADER -->
        <div class="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <div>
            <h2 class="text-xl font-bold text-gray-800">Edit Production</h2>
            <p class="text-sm text-gray-500">Ubah data produksi dengan benar</p>
          </div>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-red-500 text-xl">
            ✕
          </button>
        </div>

        <!-- BODY -->
        <div class="p-6 space-y-6">

          <!-- GRID -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- TANGGAL -->
            <div>
              <label class="label">Tanggal</label>
              <input v-model="editForm.tanggal" type="date" class="input-modern" />
            </div>

            <!-- SHIFT -->
            <div>
              <label class="label">Shift</label>
              <select v-model="editForm.shift" class="input-modern">
                <option value="1">Shift 1 (Pagi)</option>
                <option value="2">Shift 2 (Malam)</option>
              </select>
            </div>

            <!-- LINE -->
            <div>
              <label class="label">Line Produksi</label>
              <select v-model="editForm.line_id" class="input-modern">
                <option v-for="l in lineOptions" :key="l.id" :value="l.id">
                  {{ l.name }}
                </option>
              </select>
            </div>

            <!-- PART -->
            <div>
              <label class="label">Part</label>
              <select v-model="editForm.part_id" class="input-modern">
                <option v-for="p in partOptions" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <!-- PLAN -->
            <div>
              <label class="label">Plan (Target)</label>
              <input v-model.number="editForm.plan" type="number" min="0" class="input-modern" />
            </div>

            <!-- ACTUAL -->
            <div>
              <label class="label">Actual (Hasil)</label>
              <input v-model.number="editForm.actual" type="number" min="0" class="input-modern text-emerald-600 font-semibold" />
            </div>

          </div>

          <!-- STATUS & PCS (FULL WIDTH BIAR RAPIH) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- STATUS -->
            <div>
              <label class="label">Status (Auto)</label>
              <div
                class="input-modern font-semibold"
                :class="{
                  'text-green-600': editForm.actual === editForm.plan,
                  'text-blue-600': editForm.actual > editForm.plan,
                  'text-red-500': editForm.actual < editForm.plan
                }"
              >
                {{
                  editForm.actual > editForm.plan
                    ? 'Over Target'
                    : editForm.actual === editForm.plan
                    ? 'Achieved'
                    : 'Not Achieved'
                }}
              </div>
            </div>

            <!-- PCS -->
            <div>
              <label class="label">PCS</label>
              <div class="input-modern font-semibold">
                {{ editForm.actual }}
              </div>
            </div>

          </div>

        </div>

        <!-- FOOTER -->
        <div class="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">

          <button
            @click="showEditModal = false"
            class="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
          >
            Batal
          </button>

          <button
            @click="updateData"
            class="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
          >
            Update
          </button>

        </div>

      </div>
    </div>
</template>

<style scoped>
.brand-logo {
  width: 226px;
}

input:focus-visible {
  outline: none;
}

input:focus {
  border-color: rgb(59 130 246);
}

.label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 6px;
  display: block;
}

.input-modern {
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  transition: 0.2s;
}

.input-modern:focus {
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  outline: none;
}
</style>
