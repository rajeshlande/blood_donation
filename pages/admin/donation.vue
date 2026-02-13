<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Donation <span class="text-red-600">Collection</span> Desk</h1>
        <p class="text-slate-500">Record successful units and handle phlebotomy outcomes.</p>
      </div>
      <div class="bg-slate-900 px-4 py-2 rounded-2xl text-white shadow-lg shadow-slate-100 flex items-center space-x-2">
         <div class="flex space-x-1">
            <div class="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
            <div class="h-2 w-2 bg-red-400 rounded-full animate-pulse delay-75"></div>
            <div class="h-2 w-2 bg-red-300 rounded-full animate-pulse delay-150"></div>
         </div>
         <span class="text-xs font-black uppercase tracking-widest">Medical Post Alpha</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left: Queue (4 cols) -->
      <div class="lg:col-span-4 space-y-6">
        <div class="card p-6 border-slate-100 bg-white">
           <h3 class="font-black text-slate-800 uppercase tracking-widest text-xs mb-4">Eligible Queue</h3>
           <div class="relative">
              <input 
                v-model="searchQuery" 
                @input="handleSearch"
                type="text" 
                placeholder="Search Mobile/ID" 
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
              >
              <svg class="w-5 h-5 absolute left-3 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
           </div>
           <p class="mt-2 text-[10px] text-slate-400 italic">Showing donors in ELIGIBLE state only.</p>
        </div>

        <div class="space-y-3">
           <div v-if="searching" class="flex justify-center py-8">
              <span class="animate-spin rounded-full h-8 w-8 border-3 border-red-600 border-t-transparent"></span>
           </div>
           <div 
             v-for="donor in searchResults" 
             :key="donor.id"
             @click="selectDonor(donor)"
             :class="['card p-4 cursor-pointer transition-all hover:scale-[1.02]', selectedDonor?.id === donor.id ? 'border-red-600 bg-red-50 shadow-md' : 'hover:border-slate-300 bg-white']"
           >
              <div class="flex justify-between items-center">
                 <div>
                    <p class="font-black text-slate-800">{{ donor.name }}</p>
                    <p class="text-xs text-slate-500 font-mono">+91 {{ donor.mobile }}</p>
                 </div>
                 <span class="bg-green-50 text-green-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-green-100 tracking-widest">Wait Room</span>
              </div>
           </div>
           <div v-if="!searching && searchQuery && searchResults.length === 0" class="text-center py-8 text-slate-400 text-sm italic">No eligible donors found.</div>
        </div>
      </div>

      <!-- Right: Donation Record (8 cols) -->
      <div class="lg:col-span-8">
        <div v-if="!selectedDonor" class="h-full min-h-[450px] flex flex-col items-center justify-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center p-12">
            <div class="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200 mb-6">
                <svg class="w-20 h-20 text-red-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
            </div>
            <h3 class="text-2xl font-black text-slate-300">Awaiting Validated Donor</h3>
            <p class="text-slate-400 max-w-sm mt-2">Only donors who pass the medical desk with ELIGIBLE status appear here.</p>
        </div>

        <div v-else class="space-y-6">
           <div class="card p-0 bg-white border-2 border-slate-100 shadow-2xl shadow-slate-100 overflow-hidden rounded-[2.5rem]">
              <div class="bg-slate-900 p-8 text-white flex justify-between items-center">
                 <div class="flex items-center space-x-6">
                    <div class="h-20 w-20 bg-red-600 rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl shadow-red-900/20">
                       {{ formatBloodGroup(selectedDonor.bloodGroup) }}
                    </div>
                    <div>
                       <h2 class="text-3xl font-black tracking-tight">{{ selectedDonor.name }}</h2>
                       <p class="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Ref ID: {{ selectedDonor.id.substring(0,8) }} | {{ selectedDonor.gender }}</p>
                    </div>
                 </div>
                 <div class="text-right hidden sm:block">
                    <span class="block text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Status Verified</span>
                    <p class="text-2xl font-black text-white">ELIGIBLE</p>
                 </div>
              </div>

              <div class="p-8">
                 <form @submit.prevent="handleDonationSubmit" class="space-y-10">
                    <!-- Session Details -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div class="space-y-1.5">
                          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Phlebotomist ID</label>
                          <input v-model="logForm.phlebotomistId" type="text" placeholder="EMP-123" required class="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold">
                       </div>
                       <div class="space-y-1.5">
                          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Units Collected</label>
                          <input v-model.number="logForm.units" type="number" step="0.5" required class="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold">
                       </div>
                       <div class="space-y-1.5">
                          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Collection Location</label>
                          <input v-model="logForm.location" type="text" required class="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold">
                       </div>
                    </div>

                    <!-- Outcome Selection -->
                    <div class="space-y-4">
                       <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Outcome</label>
                       <div class="grid grid-cols-2 gap-4">
                          <button 
                            type="button" 
                            @click="logForm.status = 'DONATED'"
                            :class="['py-6 rounded-3xl border-2 flex flex-col items-center justify-center space-y-2 transition-all', logForm.status === 'DONATED' ? 'border-green-500 bg-green-50 text-green-700 shadow-lg' : 'border-slate-100 text-slate-400 hover:border-slate-200']"
                          >
                             <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                             <span class="font-black uppercase tracking-widest text-xs">Successfully Donated</span>
                          </button>
                          <button 
                            type="button" 
                            @click="logForm.status = 'NOT_DONATED'"
                            :class="['py-6 rounded-3xl border-2 flex flex-col items-center justify-center space-y-2 transition-all', logForm.status === 'NOT_DONATED' ? 'border-red-500 bg-red-50 text-red-700 shadow-lg' : 'border-slate-100 text-slate-400 hover:border-slate-200']"
                          >
                             <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                             <span class="font-black uppercase tracking-widest text-xs">Donation Failed</span>
                          </button>
                       </div>
                    </div>

                    <!-- Failure Details -->
                    <div v-if="logForm.status === 'NOT_DONATED'" class="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                       <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason for Failure</label>
                       <select v-model="logForm.failureReason" required class="w-full px-4 py-4 rounded-2xl border-2 border-red-100 bg-red-50 focus:ring-0 outline-none transition-all font-bold text-red-900">
                          <option value="">Select failure reason...</option>
                          <option v-for="reason in DONATION_FAILURE_REASONS" :key="reason" :value="reason">{{ reason }}</option>
                       </select>
                    </div>

                    <div class="flex items-center justify-between pt-8 border-t border-slate-50">
                       <button type="button" @click="selectedDonor = null" class="text-slate-400 hover:text-slate-600 font-black uppercase tracking-widest text-[10px]">Cancel Desk Action</button>
                       <button 
                         type="submit" 
                         :disabled="submitting" 
                         class="bg-red-600 text-white px-12 py-4 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-red-700 hover:shadow-2xl hover:shadow-red-200 transition-all flex items-center justify-center space-x-3 disabled:bg-slate-200"
                       >
                          <span v-if="submitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          <span>{{ logForm.status === 'DONATED' ? 'Complete Donation' : 'Record Failure' }}</span>
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatBloodGroup } from '~/utils/blood-group'
import { DONATION_FAILURE_REASONS } from '~/utils/lifecycle'

const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const selectedDonor = ref(null)
const submitting = ref(false)

const logForm = ref({
  phlebotomistId: '',
  units: 1,
  location: '',
  status: 'DONATED',
  failureReason: '',
  startTime: new Date().toISOString()
})

async function handleSearch() {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  searching.value = true
  try {
    const res = await $fetch('/api/donors/search', {
      params: { q: searchQuery.value, status: 'ELIGIBLE' }
    })
    searchResults.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    searching.value = false
  }
}

function selectDonor(donor) {
  selectedDonor.value = donor
  logForm.value = {
    phlebotomistId: '',
    units: 1,
    location: donor.registeredCamp?.location || 'At Camp',
    status: 'DONATED',
    failureReason: '',
    startTime: new Date().toISOString(),
    campId: donor.registeredCampId
  }
}

async function handleDonationSubmit() {
  if (!selectedDonor.value) return
  submitting.value = true
  try {
    const res = await $fetch('/api/donations/log', {
      method: 'POST',
      body: {
        donorId: selectedDonor.value.id,
        ...logForm.value,
        endTime: new Date().toISOString()
      }
    })
    if (res.success) {
      alert(`Donation record finalized. Outcome: ${logForm.value.status}`)
      selectedDonor.value = null
      searchQuery.value = ''
      searchResults.value = []
    }
  } catch (e) {
     alert(e.data?.statusMessage || 'Failed to record donation.')
  } finally {
    submitting.value = false
  }
}

definePageMeta({
  middleware: 'auth'
})
</script>
