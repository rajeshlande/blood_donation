<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Manage Donation Camps</h1>
        <p class="text-slate-500">Organize, track, and manage all blood donation camps across the nation.</p>
      </div>
      <button @click="isModalOpen = true" class="btn-primary flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
        <span>Organize New Camp</span>
      </button>
    </div>

    <div v-if="pending" class="flex justify-center py-24">
      <span class="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></span>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="camp in camps" :key="camp.id" class="card group relative">
        <!-- Status Badge -->
        <span :class="[
          'absolute top-4 right-4 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
          statusStyles[camp.status]
        ]">
          {{ camp.status }}
        </span>

        <h3 class="text-xl font-bold text-slate-800 pr-20">{{ camp.name }}</h3>
        <div class="mt-4 space-y-3">
          <div class="flex items-center text-sm text-slate-500">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4v4m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
            {{ new Date(camp.date).toLocaleDateString(undefined, { dateStyle: 'long' }) }}
          </div>
          <div class="flex items-center text-sm text-slate-500">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
            {{ camp.location }}
          </div>
          <div class="flex items-center text-sm text-slate-500">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
             {{ camp.organizer || 'Individual Organicer' }}
          </div>
        </div>

        <div class="mt-6 pt-6 border-t flex items-center justify-between">
           <div class="text-xs text-slate-500">
              <span class="font-black text-red-600">{{ camp.totalUnits }}</span> Units from <span class="font-bold text-slate-700">{{ camp.donationCount }}</span> Donors
           </div>
           <div class="flex space-x-2">
              <button @click="editCamp(camp)" class="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
              </button>
              <button @click="deleteCamp(camp.id)" class="p-2 text-slate-400 hover:text-red-600 transition-colors">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
              </button>
           </div>
        </div>
      </div>
      <div v-if="camps.length === 0" class="col-span-full py-24 text-center text-slate-400 italic">
         No camps found. Start by organizing one!
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
       <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">{{ editingId ? 'Update Camp Details' : 'Organize New Camp' }}</h2>
          <form @submit.prevent="saveCamp" class="space-y-4">
             <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Camp Name</label>
                <input v-model="form.name" type="text" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none" placeholder="e.g. Mumbai Life Saver Camp">
             </div>
             <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input v-model="form.date" type="datetime-local" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
             </div>
             <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input v-model="form.location" type="text" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none" placeholder="Specific address or area">
             </div>
             <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Organizer (Optional)</label>
                <input v-model="form.organizer" type="text" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none" placeholder="Company or Community name">
             </div>
             <div v-if="editingId">
                <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select v-model="form.status" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
                   <option value="UPCOMING">Upcoming</option>
                   <option value="ACTIVE">Active</option>
                   <option value="COMPLETED">Completed</option>
                   <option value="CANCELLED">Cancelled</option>
                </select>
             </div>
             <div class="flex justify-end space-x-3 pt-6">
                <button type="button" @click="closeModal" class="px-6 py-2 text-slate-500 font-medium">Cancel</button>
                <button type="submit" :disabled="saving" class="btn-primary min-w-[120px] flex justify-center items-center">
                   <span v-if="saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                   {{ editingId ? 'Update Camp' : 'Create Camp' }}
                </button>
             </div>
          </form>
       </div>
    </div>
  </div>
</template>

<script setup>
const { data: response, pending, refresh } = await useFetch('/api/camps')
const camps = computed(() => response.value?.data || [])

const isModalOpen = ref(false)
const editingId = ref(null)
const saving = ref(false)

const form = ref({
  name: '',
  date: '',
  location: '',
  organizer: '',
  status: 'UPCOMING'
})

const statusStyles = {
  UPCOMING: 'bg-blue-50 border-blue-100 text-blue-600',
  ACTIVE: 'bg-green-50 border-green-100 text-green-600',
  COMPLETED: 'bg-slate-50 border-slate-100 text-slate-600',
  CANCELLED: 'bg-red-50 border-red-100 text-red-600'
}

function editCamp(camp) {
  editingId.value = camp.id
  form.value = {
    name: camp.name,
    date: new Date(camp.date).toISOString().slice(0, 16),
    location: camp.location,
    organizer: camp.organizer,
    status: camp.status
  }
  isModalOpen.value = true
}

async function saveCamp() {
  saving.value = true
  try {
    const url = editingId.value ? `/api/camps/${editingId.value}` : '/api/camps'
    const method = editingId.value ? 'PUT' : 'POST'
    
    await $fetch(url, {
      method,
      body: form.value
    })
    
    closeModal()
    refresh()
  } catch (e) {
    alert('Failed to save camp details.')
  } finally {
    saving.value = false
  }
}

async function deleteCamp(id) {
  if (!confirm('Are you sure you want to delete this camp? This action cannot be undone.')) return
  try {
    await $fetch(`/api/camps/${id}`, { method: 'DELETE' })
    refresh()
  } catch (e) {
    alert('Failed to delete camp.')
  }
}

function closeModal() {
  isModalOpen.value = false
  editingId.value = null
  form.value = { name: '', date: '', location: '', organizer: '', status: 'UPCOMING' }
}
</script>
