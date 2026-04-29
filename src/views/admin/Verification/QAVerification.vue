<script setup lang="ts">
import { onMounted, ref, shallowRef, computed } from 'vue'
import { useQAStore } from '@/stores/Verification/QAVerification'
import { useProductionStore } from '@/stores/Production/Production'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'

const qaStore = useQAStore()
const productionStore = useProductionStore()

const page = ref({ title: "QA Verification" });
const breadcrumbs = shallowRef([
  {
    title: 'Admin',
    disabled: false,
    href: '#'
  },
  {
    title: 'QA Verification',
    disabled: true,
    href: '#'
  }
]);

const { 
  updateProduction
} = productionStore

const selectedImage = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const search = ref('')
const showDropdown = ref(false)

const triggerFile = () => fileInput.value?.click()

const handleFile = (e: any) => {
  const file = e.target.files[0]
  if (file) {
    qaStore.form.qa_image = file
    selectedImage.value = URL.createObjectURL(file)
  }
}

const submitQA = async () => {
  try {
    await qaStore.submitQA()
    selectedImage.value = null
    alert('QA berhasil disubmit')
  } catch (err: any) {
    alert(err.message)
  }
}

const filteredProductions = computed(() => {
  return productionStore.productions.filter((p: any) =>
    `${p.tanggal} ${p.line_id}`.toLowerCase().includes(search.value.toLowerCase())
  )
})

const selectProduction = (p: any) => {
  qaStore.form.production_id = p.id
  search.value = `${p.tanggal} - Line ${p.line_id}`
  showDropdown.value = false
}

onMounted(() => {
  qaStore.fetchQA()
  productionStore.fetchProductions()
})
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" class="mb-7"></BaseBreadcrumb>
  <div class="p-6 space-y-6">

    <!-- FORM QA -->
    <div class="bg-white p-6 rounded-xl shadow border space-y-4">

      <h2 class="font-bold text-lg">Upload QA</h2>

      <div class="relative">
        <input
          v-model="search"
          @focus="showDropdown = true"
          placeholder="Cari Production..."
          class="input"
        />

        <div
          v-if="showDropdown"
          class="absolute z-50 w-full bg-white border rounded-lg shadow max-h-60 overflow-y-auto mt-1"
        >
          <div
            v-for="p in filteredProductions"
            :key="p.id"
            @click="selectProduction(p)"
            class="px-4 py-2 hover:bg-blue-50 cursor-pointer"
          >
            {{ p.tanggal }} - Line {{ p.line_id }} (ID: {{ p.id }})
          </div>

          <div v-if="filteredProductions.length === 0" class="p-3 text-gray-400">
            Tidak ditemukan
          </div>
        </div>
      </div>

      <!-- Upload -->
      <div @click="triggerFile" class="border-dashed border p-6 text-center cursor-pointer">
        <img v-if="selectedImage" :src="selectedImage" class="h-24 mx-auto" />
        <p v-else>Klik untuk upload gambar QA</p>
      </div>

      <input type="file" class="hidden" ref="fileInput" @change="handleFile" />

      <textarea
        v-model="qaStore.form.notes"
        placeholder="Catatan QA..."
        class="input"
      />

      <div class="flex justify-end">
        <button @click="submitQA" class="btn-primary">
          Submit QA
        </button>
      </div>
    </div>

    <!-- TABLE QA -->
    <div class="bg-white rounded-2xl shadow border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          
          <!-- HEADER -->
          <thead class="bg-gray-50 border-b">
            <tr class="text-left text-gray-500 uppercase text-xs">
              <th class="px-6 py-4">No</th>
              <th class="px-6 py-4">Tanggal</th>
              <th class="px-6 py-4">Line</th>
              <th class="px-6 py-4">Part</th>
              <th class="px-6 py-4 text-center">Image</th>
              <th class="px-6 py-4 text-center">Status</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>

          <!-- BODY -->
          <tbody class="divide-y">
            <tr
              v-for="(q, i) in qaStore.qaList"
              :key="q.id"
              class="hover:bg-gray-50 transition"
            >
              <!-- NO -->
              <td class="px-6 py-4 font-medium text-gray-700">
                {{ i + 1 }}
              </td>

              <!-- TANGGAL -->
              <td class="px-6 py-4 text-gray-600">
                {{ q.tanggal || '-' }}
              </td>

              <!-- LINE -->
              <td class="px-6 py-4 font-semibold text-gray-800">
                Line {{ q.line_id }}
              </td>

              <!-- PART -->
              <td class="px-6 py-4 text-gray-600">
                Part {{ q.part_id }}
              </td>

              <!-- IMAGE -->
              <td class="px-6 py-4 text-center">
                <div v-if="q.evidence_image" class="group relative inline-block">
                  <img
                    :src="`http://localhost:8080/uploads/qa/${q.evidence_image}`"
                    class="h-10 w-10 object-cover rounded-lg border"
                  />

                  <!-- Hover Preview -->
                  <div class="hidden group-hover:block absolute z-50 top-12 left-1/2 -translate-x-1/2">
                    <img
                      :src="`http://localhost:8080/uploads/qa/${q.evidence_image}`"
                      class="h-32 rounded-xl shadow-lg border"
                    />
                  </div>
                </div>

                <span v-else class="text-gray-400 italic text-xs">
                  No Image
                </span>
              </td>

              <!-- STATUS -->
              <td class="px-6 py-4 text-center">
                <span
                  class="px-3 py-1 text-xs rounded-full font-semibold"
                  :class="{
                    'bg-yellow-100 text-yellow-700': q.status === 'pending',
                    'bg-green-100 text-green-700': q.status === 'approved',
                    'bg-red-100 text-red-700': q.status === 'rejected'
                  }"
                >
                  {{ q.status.toUpperCase() }}
                </span>
              </td>

              <!-- ACTION -->
              <td class="px-6 py-4 text-right space-x-2">
                <button
                  @click="qaStore.verifyQA(q.id, 'approved')"
                  :disabled="q.status === 'approved'"
                  class="px-3 py-1.5 text-xs rounded-lg font-medium transition"
                  :class="
                    q.status === 'approved'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  "
                >
                  Approve
                </button>

                <button
                  @click="qaStore.verifyQA(q.id, 'rejected')"
                  class="px-3 py-1.5 text-xs rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                >
                  Reject
                </button>
              </td>
            </tr>

            <!-- EMPTY STATE -->
            <tr v-if="qaStore.qaList.length === 0">
              <td colspan="7" class="py-16 text-center">
                <div class="flex flex-col items-center gap-3 text-gray-400">
                  <p class="text-sm">Belum ada data QA</p>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.btn-primary {
  background: #2563eb;
  color: white;
  padding: 10px;
  border-radius: 8px;
}
</style>