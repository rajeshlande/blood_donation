<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Donor Registration</h1>
      <p class="text-slate-600">Join the lifesaver community in India. Your contribution matters.</p>
    </div>

    <!-- No Active Camps Warning -->
    <div v-if="!loadingCamps && activeCamps.length === 0" class="max-w-2xl mx-auto mb-8 bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center">
       <div class="inline-block p-4 bg-amber-100 text-amber-600 rounded-full mb-4">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
       </div>
       <h3 class="text-xl font-bold text-amber-900 mb-2">No Active Camps Found</h3>
       <p class="text-amber-700 leading-relaxed">Registration desk is only open during live donation camps. Please contact your nearest blood bank for upcoming schedules.</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <!-- Success/Error Messages -->
      <div v-if="success" class="bg-green-50 border border-green-200 p-4 rounded-xl text-green-700 flex items-center space-x-3">
        <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Registration successful! Redirecting to dashboard...</span>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 flex items-center space-x-3">
        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <!-- Camp Selection (Mandatory for Desk Workflow) -->
      <div class="card bg-red-50/50 border-red-100 p-6">
          <label class="block text-sm font-black text-red-900 uppercase tracking-widest mb-3">Select Active Camp Desk</label>
          <select v-model="form.registeredCampId" required class="w-full px-4 py-3 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-slate-800">
            <option value="">Select a camp to register...</option>
            <option v-for="camp in activeCamps" :key="camp.id" :value="camp.id">
              {{ camp.name }} ({{ camp.location }})
            </option>
          </select>
          <p class="mt-2 text-xs text-red-600 italic">Select the camp you are currently attending to begin medical screening.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Personal Information -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-slate-800 border-b pb-2">Personal Details</h2>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="Enter your full name">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Age (18-65)</label>
              <input v-model.number="form.age" type="number" required min="18" max="65" class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select v-model="form.gender" required class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
            <select v-model="form.bloodGroup" required class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all">
              <option v-for="bg in bloodGroups" :key="bg.value" :value="bg.value">{{ bg.label }}</option>
            </select>
          </div>
        </div>

        <!-- Contact & Address -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-slate-800 border-b pb-2">Contact & Address</h2>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Mobile Number (+91)</label>
            <div class="relative">
               <span class="absolute left-3 top-2 text-slate-400">+91</span>
               <input v-model="form.mobile" type="tel" required pattern="[6-9][0-9]{9}" class="w-full pl-12 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="9876543210">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email Address (Optional)</label>
            <input v-model="form.email" type="email" class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="email@example.com">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">State</label>
              <select v-model="form.addressState" required class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all">
                <option value="">Select State</option>
                <option v-for="(districts, state) in INDIA_LOCATIONS" :key="state" :value="state">{{ state }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">District</label>
              <select v-model="form.addressDistrict" required :disabled="!form.addressState" class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed">
                <option value="">Select District</option>
                <option v-for="district in currentDistricts" :key="district" :value="district">{{ district }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Health History -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-slate-800 border-b pb-2">Health & Consent</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Last Donation Date</label>
            <input v-model="form.lastDonationDate" type="date" class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all">
            <p class="text-xs text-slate-400 mt-1 italic text-right">Leave blank if never donated before</p>
          </div>
          <div class="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100 mt-6">
             <input type="checkbox" required class="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500">
             <span class="text-xs text-slate-600 leading-tight">I hereby declare that all information provided is true to my knowledge and I consent to the blood donation process.</span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end space-x-4 pt-6">
        <button type="reset" class="px-6 py-2 text-slate-500 hover:text-slate-700 font-medium">Clear Form</button>
        <button type="submit" :disabled="loading || !form.registeredCampId" class="btn-primary min-w-[160px] flex items-center justify-center space-x-2">
          <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
          <span>{{ loading ? 'Registering...' : 'Complete Registration' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { INDIA_LOCATIONS } from '~/utils/india-locations.ts'

const bloodGroups = [
  { label: 'A Positive (A+)', value: 'A_POSITIVE' },
  { label: 'A Negative (A-)', value: 'A_NEGATIVE' },
  { label: 'B Positive (B+)', value: 'B_POSITIVE' },
  { label: 'B Negative (B-)', value: 'B_NEGATIVE' },
  { label: 'AB Positive (AB+)', value: 'AB_POSITIVE' },
  { label: 'AB Negative (AB-)', value: 'AB_NEGATIVE' },
  { label: 'O Positive (O+)', value: 'O_POSITIVE' },
  { label: 'O Negative (O-)', value: 'O_NEGATIVE' },
]

// 1. Fetch ACTIVE camps
const { data: campsResponse, pending: loadingCamps } = await useFetch('/api/camps')
const activeCamps = computed(() => {
  return (campsResponse.value?.data || []).filter(c => c.status === 'ACTIVE')
})

const form = ref({
  name: '',
  age: 18,
  gender: 'MALE',
  bloodGroup: 'O_POSITIVE',
  mobile: '',
  email: '',
  addressState: '',
  addressDistrict: '',
  addressCity: '',
  pincode: '',
  lastDonationDate: '',
  medicalConditions: '',
  registeredCampId: ''
})

const currentDistricts = computed(() => {
  if (!form.value.addressState) return []
  return INDIA_LOCATIONS[form.value.addressState] || []
})

watch(() => form.value.addressState, () => {
  form.value.addressDistrict = ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    const response = await $fetch('/api/donors/register', {
      method: 'POST',
      body: form.value
    })

    if (response.success) {
      success.value = true
      setTimeout(() => {
        navigateTo('/admin') // Redirect to dashboard or a success page
      }, 2000)
    }
  } catch (e) {
    error.value = e.data?.statusMessage || 'An error occurred during registration. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
