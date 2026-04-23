<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import { useAuthStore } from '@/stores/Admin/auth'
import { useUserStore } from '@/stores/Admin/user'
import { useNotificationStore } from '@/stores/notification'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const userStore = useUserStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const addUserModal = ref(false)
const editModal = ref(false)

const imagePreview = ref<string | null>(null)
const editImagePreview = ref<string | null>(null)

const fileInput = ref<HTMLInputElement | null>(null)
const editFileInput = ref<HTMLInputElement | null>(null)

const showPass = ref(false)
const showConfirmPass = ref(false)
const showEditPass = ref(false)
const showEditConfirmPass = ref(false)

imagePreview.value = null

const page = ref({ title: "User Management" });
const breadcrumbs = shallowRef([
  {
    title: 'Admin',
    disabled: false,
    href: '#'
  },
  {
    title: 'User Management',
    disabled: true,
    href: '#'
  }
]);



// const openEditModal = (user) => {
//   // Populate data dari user yang dipilih
//   editForm.value = {
//     id: user.id,
//     nama: user.nama,
//     username: user.username,
//     role: user.role || '',
//     line_area: user.line_area ? [...user.line_area] : [],
//     password: '', 
//     confirmPassword: '',
//     profile_pic: user.profile_pic || null
//   };
  
//   editImagePreview.value = user.profile_pic || null;
//   editModal.value = true;
// };

// const triggerEditFileInput = () => {
//   editFileInput.value.click();
// };

// const handleEditFileUpload = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     editForm.value.profile_pic = file;
//     editImagePreview.value = URL.createObjectURL(file);
//   }
// };

// const removeEditImage = () => {
//   editForm.value.profile_pic = null;
//   editImagePreview.value = null;
//   if (editFileInput.value) editFileInput.value.value = '';
// };

const toggleEditLine = (line) => {
  const index = userStore.editForm.line_area.indexOf(line);
  if (index === -1) {
    userStore.editForm.line_area.push(line);
  } else {
    userStore.editForm.line_area.splice(index, 1);
  }
};

const createUser = async () => {
  try {
    await userStore.createUser()
    addUserModal.value = false
    imagePreview.value = null
  } catch (e: any) {
    notificationStore.showAlertError(e.message)
  }
}

const updateUser = async () => {
  try {
    await userStore.updateUser()
    editModal.value = false
  } catch (e: any) {
    notificationStore.showAlertError(e.message)
  }
}

const deleteUser = async (id: number, nama: string) => {
  notificationStore.showConfirm("Hapus Pengguna", `Yakin ingin menghapus ${nama}?`, async () => {
    try {
      await userStore.deleteUser(id)
      notificationStore.showAlertSuccess(`Pengguna ${nama} berhasil dihapus`)
    } catch (e: any) {
      notificationStore.showAlertError(e.message)
    }
  })
}

const triggerFileInput = () => fileInput.value?.click()

const handleFileUpload = (event: any) => {
  const file = event.target.files[0]
  if (file) {
    userStore.form.profile_pic = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const removeImage = () => {
  userStore.form.profile_pic = null;
  imagePreview.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

const toggleLine = (line) => {
  const index = userStore.form.line_area.indexOf(line);
  if (index === -1) {
    userStore.form.line_area.push(line);
  } else {
    userStore.form.line_area.splice(index, 1);
  }
};

const triggerEditFileInput = () => editFileInput.value?.click()

const handleEditFileUpload = (event: any) => {
  const file = event.target.files[0]
  if (file) {
    userStore.editForm.profile_pic = file
    editImagePreview.value = URL.createObjectURL(file)
  }
}

const removeEditImage = () => {
  userStore.editForm.profile_pic = null
  editImagePreview.value = null
  if (editFileInput.value) editFileInput.value.value = ''
}

const openEditModal = (user: any) => {
  userStore.setEditUser(user)
  editImagePreview.value = user.profile_pic
  editModal.value = true
}

const lines = ['Line A', 'Line B', 'Line C', 'Line D', 'Line E', 'Line F', 'Line G', 'Line H', 'Line 300T', 'Line SP']

onMounted(() => {
  if (!authStore.isSuperUser()) {
    router.push('/unauthorized')
  } else {
    userStore.fetchUsers()
  }
})
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" class="mb-7"></BaseBreadcrumb>
  <div class="p-6 space-y-6 bg-gray-50/50 min-h-screen">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
      <!-- <div>
        <h1 class="text-2xl font-bold text-gray-800 tracking-tight">User Management</h1>
        <p class="text-sm text-gray-500">Kelola akses dan peran pengguna sistem</p>
      </div> -->
      
      <button @click="addUserModal = true" class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm shadow-blue-200 transition-all active:scale-95 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Pengguna
      </button>
    </div>

    <div v-if="userStore.error" class="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="text-sm font-medium">{{ userStore.error }}</span>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Profile</th>
              <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Username</th>
              <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</th>
              <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
              <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Line Area</th>
              <th class="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest w-32">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-50">
            <tr v-if="userStore.loading" v-for="i in 3" :key="'skel'+i" class="animate-pulse">
              <td class="px-6 py-4"><div class="w-10 h-10 bg-gray-200 rounded-full"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-32"></div></td>
              <td class="px-6 py-4"><div class="h-6 bg-gray-200 rounded-full w-16"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded w-24"></div></td>
              <td class="px-6 py-4 text-right"><div class="h-8 bg-gray-200 rounded-lg w-16 ml-auto"></div></td>
            </tr>

            <tr v-else v-for="u in userStore.users" :key="u.id" class="hover:bg-blue-50/30 transition-colors group">
              <td class="px-6 py-4">
                <img v-if="u.profile_pic" :src="`http://localhost:8080/uploads/profile/${u.profile_pic}`" class="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" />
                <div v-else class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200 uppercase">
                  {{ u.nama.charAt(0) }}
                </div>
              </td>

              <td class="px-6 py-4">
                <span class="text-sm font-medium text-blue-600">@{{ u.username }}</span>
              </td>

              <td class="px-6 py-4">
                <span class="text-sm font-bold text-gray-800">{{ u.nama }}</span>
              </td>

              <td class="px-6 py-4">
                <span 
                  :class="{
                    'bg-purple-100 text-purple-700 border-purple-200': u.role?.toLowerCase() === 'admin',
                    'bg-blue-100 text-blue-700 border-blue-200': u.role?.toLowerCase() === 'manager',
                    'bg-emerald-100 text-emerald-700 border-emerald-200': u.role?.toLowerCase() === 'operator',
                    'bg-gray-100 text-gray-600 border-gray-200': u.role?.toLowerCase() === 'staff',
                  }" 
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider"
                >
                  {{ u.role }}
                </span>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1 max-w-[200px]">
                  <span v-for="line in u.line_area" :key="line" class="px-2 py-0.5 bg-white text-gray-500 border border-gray-200 rounded text-[10px] font-semibold shadow-sm">
                    {{ line }}
                  </span>
                  <span v-if="!u.line_area?.length" class="text-gray-300 text-xs italic">N/A</span>
                </div>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openEditModal(u)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="deleteUser(u.id, u.nama)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Hapus">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <div v-if="addUserModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-gray-900/50" @click="addUserModal = false"></div>

    <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
      
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
        <h2 class="font-bold text-lg text-gray-800">Tambah User Baru</h2>
        <button @click="addUserModal = false" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-5 overflow-y-auto custom-scrollbar">
        
        <div class="flex flex-col items-center justify-center mb-2">
          <label class="block text-sm font-semibold text-gray-700 mb-2 w-full text-center">Foto Profil <span class="text-gray-400 font-normal">(Opsional)</span></label>
          
          <div class="relative group cursor-pointer" @click="triggerFileInput">
            <div class="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden transition-all group-hover:border-blue-500 group-hover:bg-blue-50">
              
              <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" alt="Preview Profil" />
              
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <div v-if="imagePreview" class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>

          <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileUpload" />
          
          <button v-if="imagePreview" @click="removeImage" class="mt-2 text-xs font-medium text-red-500 hover:text-red-700 transition-colors">
            Hapus Foto
          </button>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
          <input v-model="userStore.form.nama" type="text" placeholder="Masukkan nama user..." class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm text-gray-700" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
          <input v-model="userStore.form.username" type="text" placeholder="Masukkan username user..." class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm text-gray-700" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
          <select v-model="userStore.form.role" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm text-gray-700 appearance-none">
            <option value="" disabled>Pilih Role...</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="Operator">Operator</option>
          </select>
        </div>

        <div>
          <div class="flex justify-between items-center mb-1.5">
            <label class="block text-sm font-semibold text-gray-700">Line Area</label>
            <span class="text-[11px] text-gray-400 font-medium">Bisa pilih lebih dari satu</span>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <button v-for="line in lines" :key="line" @click="toggleLine(line)" class="px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-200" :class="userStore.form.line_area.includes(line) ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'">
              {{ line }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <div class="relative group">
            <input 
              v-model="userStore.form.password" 
              :type="showPass ? 'text' : 'password'" 
              placeholder="••••••••" 
              class="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm text-gray-700" 
            />
            <button 
              type="button"
              @click="showPass = !showPass"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg v-if="!showPass" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password</label>
          <div class="relative group">
            <input 
              v-model="userStore.form.confirmPassword" 
              :type="showConfirmPass ? 'text' : 'password'" 
              placeholder="••••••••" 
              class="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm text-gray-700" 
            />
            <button 
              type="button"
              @click="showConfirmPass = !showConfirmPass"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg v-if="!showConfirmPass" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
          <p v-if="userStore.form.confirmPassword && userStore.form.password !== userStore.form.confirmPassword" class="text-[10px] text-red-500 mt-1 ml-1 font-medium italic">
            * Password tidak cocok
          </p>
        </div>

      </div>

      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
        <button @click="addUserModal = false" class="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-colors">
          Batal
        </button>
        <button @click="createUser" class="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
          Simpan User
        </button>
      </div>

    </div>
  </div>

  <div v-if="editModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-gray-900/50" @click="editModal = false"></div>

    <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
      
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
        <h2 class="font-bold text-lg text-gray-800">Edit User</h2>
        <button @click="editModal = false" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-5 overflow-y-auto custom-scrollbar">
        
        <div class="flex flex-col items-center justify-center mb-2">
          <label class="block text-sm font-semibold text-gray-700 mb-2 w-full text-center">Foto Profil <span class="text-gray-400 font-normal">(Opsional)</span></label>
          
          <div class="relative group cursor-pointer" @click="triggerEditFileInput">
            <div class="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden transition-all group-hover:border-blue-500 group-hover:bg-blue-50">
              
              <img v-if="editImagePreview" :src="editImagePreview" class="w-full h-full object-cover" alt="Preview Profil" />
              
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <div v-if="editImagePreview" class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>

          <input type="file" ref="editFileInput" accept="image/*" class="hidden" @change="handleEditFileUpload" />
          
          <button v-if="editImagePreview" @click="removeEditImage" class="mt-2 text-xs font-medium text-red-500 hover:text-red-700 transition-colors">
            Hapus Foto
          </button>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
          <input v-model="userStore.editForm.nama" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm text-gray-700" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
          <input v-model="userStore.editForm.username" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm text-gray-700" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
          <select v-model="userStore.editForm.role" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm text-gray-700 appearance-none">
            <option value="" disabled>Pilih Role...</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="Operator">Operator</option>
          </select>
        </div>

        <div>
          <div class="flex justify-between items-center mb-1.5">
            <label class="block text-sm font-semibold text-gray-700">Line Area</label>
            <span class="text-[11px] text-gray-400 font-medium">Bisa pilih lebih dari satu</span>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <button v-for="line in lines" :key="line" @click="toggleEditLine(line)" class="px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-200" :class="userStore.editForm.line_area.includes(line) ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'">
              {{ line }}
            </button>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-100 mt-2">
          <p class="text-xs text-gray-500 mb-3 italic">Kosongkan jika tidak ingin mengubah password.</p>
          
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password Baru</label>
          <div class="relative group mb-3">
            <input 
              v-model="userStore.editForm.password" 
              :type="showEditPass ? 'text' : 'password'" 
              placeholder="••••••••" 
              class="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm text-gray-700" 
            />
            <button 
              type="button"
              @click="showEditPass = !showEditPass"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg v-if="!showEditPass" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
            </button>
          </div>

          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
          <div class="relative group">
            <input 
              v-model="userStore.editForm.confirmPassword" 
              :type="showEditConfirmPass ? 'text' : 'password'" 
              placeholder="••••••••" 
              class="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm text-gray-700" 
            />
            <button 
              type="button"
              @click="showEditConfirmPass = !showEditConfirmPass"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg v-if="!showEditConfirmPass" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
            </button>
          </div>
          <p v-if="userStore.editForm.password && userStore.editForm.confirmPassword && userStore.editForm.password !== userStore.editForm.confirmPassword" class="text-[10px] text-red-500 mt-1 ml-1 font-medium italic">
            * Password tidak cocok
          </p>
        </div>

      </div>

      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
        <button @click="editModal = false" class="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-colors">
          Batal
        </button>
        <button @click="updateUser" class="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
          Simpan Perubahan
        </button>
      </div>

    </div>
  </div>
</template>