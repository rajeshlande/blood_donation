<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Medical <span class="text-red-600">Screening</span> Desk</h1>
        <p class="text-slate-500">Perform mandatory health examinations for registered donors.</p>
      </div>
      <div class="bg-red-600 px-4 py-2 rounded-2xl text-white shadow-lg shadow-red-100 flex items-center space-x-2">
         <span class="animate-pulse h-2 w-2 bg-white rounded-full"></span>
         <span class="text-xs font-black uppercase tracking-widest">Live Campaign Session</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left: Donor Search (4 cols) -->
      <div class="lg:col-span-4 space-y-6">
        <div class="card p-6 border-slate-100">
           <h3 class="font-black text-slate-800 uppercase tracking-widest text-xs mb-4">Quick Search</h3>
           <div class="relative">
              <input 
                v-model="searchQuery" 
                @input="handleSearch"
                type="text" 
                placeholder="Mobile / ID / Name" 
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
              >
              <svg class="w-5 h-5 absolute left-3 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
           </div>
           <p class="mt-2 text-[10px] text-slate-400 italic">Showing donors in REGISTERED state only.</p>
        </div>

        <div class="space-y-3">
           <div v-if="searching" class="flex justify-center py-8">
              <span class="animate-spin rounded-full h-8 w-8 border-3 border-red-600 border-t-transparent"></span>
           </div>
           <div v-else-if="searchResults.length === 0 && searchQuery" class="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p class="text-sm font-bold text-slate-400 italic">No matching registered donors found.</p>
           </div>
           <div 
             v-for="donor in searchResults" 
             :key="donor.id"
             @click="selectDonor(donor)"
             :class="['card p-4 cursor-pointer transition-all hover:scale-[1.02]', selectedDonor?.id === donor.id ? 'border-red-600 bg-red-50 shadow-md' : 'hover:border-slate-300']"
           >
              <div class="flex justify-between items-center">
                 <div>
                    <p class="font-black text-slate-800">{{ donor.name }}</p>
                    <p class="text-xs text-slate-500 font-mono">+91 {{ donor.mobile }}</p>
                 </div>
                 <div class="text-right">
                    <span class="inline-flex w-8 h-8 rounded-lg bg-white border border-slate-100 items-center justify-center font-black text-[10px] text-red-600 shadow-sm">{{ formatBloodGroup(donor.bloodGroup) }}</span>
                 </div>
              </div>
              <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                 <span class="uppercase tracking-tighter">{{ donor.registeredCamp?.name || 'Direct Entry' }}</span>
                 <span class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded tracking-widest uppercase">{{ donor.status }}</span>
              </div>
           </div>
        </div>
      </div>

      <!-- Right: Examination Form (8 cols) -->
      <div class="lg:col-span-8">
        <div v-if="!selectedDonor" class="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center p-12">
            <div class="bg-white p-6 rounded-3xl shadow-xl shadow-slate-100 mb-6">
                <svg class="w-16 h-16 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
            </div>
            <h3 class="text-2xl font-black text-slate-400">Select a Donor to Begin Examination</h3>
            <p class="text-slate-400 max-w-sm mt-2">Find a donor by mobile or name using the quick search on the left.</p>
        </div>

        <div v-else class="space-y-6">
           <div class="card p-8 bg-white border-2 border-slate-100 shadow-xl shadow-slate-100 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-red-600 translate-x-16 -translate-y-16 rotate-45 opacity-5"></div>
              
              <!-- Header -->
              <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                 <div class="flex items-center space-x-4">
                    <div class="h-20 w-20 bg-red-600 text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl shadow-red-100">
                      {{ formatBloodGroup(selectedDonor.bloodGroup) }}
                    </div>
                    <div>
                      <h2 class="text-3xl font-black text-slate-900 leading-tight">{{ selectedDonor.name }}</h2>
                      <p class="text-slate-500 font-medium">Age: {{ selectedDonor.age }} | Gender: {{ selectedDonor.gender }}</p>
                    </div>
                 </div>
                 <div class="text-right">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Registration Session</p>
                    <p class="text-lg font-bold text-slate-700">{{ selectedDonor.registeredCamp?.name || 'Emergency/Direct' }}</p>
                 </div>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleScreeningSubmit" class="space-y-8">
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-2">
                       <label class="block text-sm font-black text-slate-800 uppercase tracking-widest">Hemoglobin (HB) <span class="text-red-500">*</span></label>
                       <div class="relative">
                          <input 
                            v-model.number="examForm.hb" 
                            type="number" 
                            step="0.1" 
                            required 
                            class="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-red-500 outline-none transition-all text-2xl font-black text-slate-800"
                            placeholder="0.0"
                          >
                          <span class="absolute right-4 top-4.5 text-slate-400 font-bold uppercase text-xs">g/dL</span>
                       </div>
                       <p class="text-[10px] text-slate-400 font-bold italic">Standard: Male ≥ 13.0 | Female ≥ 12.5</p>
                    </div>

                    <div class="space-y-2">
                       <label class="block text-sm font-black text-slate-800 uppercase tracking-widest">Body Weight <span class="text-red-500">*</span></label>
                       <div class="relative">
                          <input 
                            v-model.number="examForm.weight" 
                            type="number" 
                            step="0.5" 
                            required 
                            class="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-red-500 outline-none transition-all text-2xl font-black text-slate-800"
                            placeholder="0.0"
                          >
                          <span class="absolute right-4 top-4.5 text-slate-400 font-bold uppercase text-xs">KG</span>
                       </div>
                       <p class="text-[10px] text-slate-400 font-bold italic">Standard: Minimum 45 kg</p>
                    </div>
                 </div>

                 <div class="space-y-2">
                    <label class="block text-sm font-black text-slate-800 uppercase tracking-widest">Medical Remarks / History</label>
                    <textarea 
                      v-model="examForm.remarks" 
                      rows="3" 
                      class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-red-500 outline-none transition-all font-medium text-slate-700"
                      placeholder="Note any recent illnesses, medication, or physical observations..."
                    ></textarea>
                 </div>

                 <div v-if="validationFeedback" :class="['p-4 rounded-2xl border-2 flex items-start space-x-3', validationFeedback.success ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700']">
                    <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path :d="validationFeedback.success ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                    <div>
                       <p class="font-black uppercase tracking-widest text-xs mb-0.5">{{ validationFeedback.success ? 'Candidate Eligible' : 'Candidate Unfit' }}</p>
                       <p class="text-sm font-medium opacity-80">{{ validationFeedback.reason || 'All medical criteria satisfied for the current session.' }}</p>
                    </div>
                 </div>

                 <div class="flex items-center justify-end space-x-4 pt-8 border-t border-slate-100">
                    <button type="button" @click="selectedDonor = null" class="px-6 py-3 text-slate-400 hover:text-slate-600 font-bold uppercase tracking-widest text-xs">Clear Selection</button>
                    <button 
                      type="submit" 
                      :disabled="submitting" 
                      class="bg-slate-900 text-white px-10 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:shadow-xl hover:shadow-red-200 transition-all flex items-center justify-center space-x-3 disabled:bg-slate-200"
                    >
                       <span v-if="submitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                       <span>Finalize Screening</span>
                    </button>
                 </div>
              </form>
           </div>

           <!-- Historical Record Warning -->
           <div class="card p-6 bg-slate-50 border-none">
              <h4 class="font-bold text-slate-700 mb-2">Notice for Medical Staff</h4>
              <p class="text-xs text-slate-500 leading-relaxed italic">Screening outcomes are final for the current camp session. If a donor is marked as "Candidate Unfit", the system will record the failure reason (e.g. Low HB) and they will be blocked from the Donation Desk. Double check HB and Weight readings before finalizing.</p>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatBloodGroup } from '~/utils/blood-group'
import { validateScreening } from '~/utils/lifecycle'

const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const selectedDonor = ref(null)
const submitting = ref(false)

const examForm = ref({
  hb: null,
  weight: null,
  remarks: ''
})

const validationFeedback = computed(() => {
  if (!selectedDonor.value || examForm.value.hb === null || examForm.value.weight === null) return null
  return validateScreening(examForm.value.hb, examForm.value.weight, selectedDonor.value.gender)
})

async function handleSearch() {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  searching.value = true
  try {
    const res = await $fetch('/api/donors/search', {
      params: { q: searchQuery.value, status: 'REGISTERED' }
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
  examForm.value = { hb: null, weight: null, remarks: '' }
}

async function handleScreeningSubmit() {
  if (!selectedDonor.value) return
  submitting.value = true
  try {
    const res = await $fetch('/api/screenings', {
      method: 'POST',
      body: {
        donorId: selectedDonor.value.id,
        campId: selectedDonor.value.registeredCampId || '', // In practice this should always be there for REGISTERED donors
        hb: examForm.value.hb,
        weight: examForm.value.weight,
        remarks: examForm.value.remarks
      }
    })
    if (res.success) {
      alert(`Screening complete. Donor is now ${res.data.outcome === 'ELIGIBLE' ? 'ELIGIBLE' : 'NOT DONATED'}.`)
      selectedDonor.value = null
      searchQuery.value = ''
      searchResults.value = []
    }
  } catch (e) {
     alert(e.data?.statusMessage || 'Failed to submit screening.')
  } finally {
    submitting.value = false
  }
}

// Ensure staff access
definePageMeta({
  middleware: 'auth'
})
</script>
