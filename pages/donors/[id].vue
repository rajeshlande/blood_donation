<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div v-if="pending" class="flex justify-center py-24">
      <span class="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></span>
    </div>

    <div v-else-if="donor" class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start gap-4">
        <div class="flex items-center space-x-4">
          <div class="h-20 w-20 bg-red-600 text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl shadow-red-100">
            {{ formatBloodGroup(donor.bloodGroup) }}
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900">{{ donor.name }}</h1>
            <p class="text-slate-500">{{ donor.addressCity }}, {{ donor.addressState }}</p>
          </div>
        </div>
        <div class="flex flex-col items-end gap-3">
          <div :class="[
            'px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest border-2',
            donor.eligibility.isEligible ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-200 text-orange-700'
          ]">
            {{ donor.eligibility.isEligible ? 'Eligible to Donate' : 'On Wait Period' }}
          </div>
          <div class="flex space-x-2">
            <button @click="openEditModal" class="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
              <span>Edit Donor</span>
            </button>
            <button @click="handleDeleteDonor" class="px-3 py-1.5 text-xs font-bold text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Sidebar Info -->
        <div class="md:col-span-1 space-y-6">
          <div class="card">
            <h3 class="font-bold text-slate-800 mb-4 border-b pb-2">Contact Details</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-400">Mobile</span>
                <span class="text-slate-700 font-medium">+91 {{ donor.mobile }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Email</span>
                <span class="text-slate-700 font-medium truncate ml-2">{{ donor.email || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Age</span>
                <span class="text-slate-700 font-medium">{{ donor.age }} Years</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Gender</span>
                <span class="text-slate-700 font-medium capitalize">{{ donor.gender.toLowerCase() }}</span>
              </div>
            </div>
          </div>

          <div class="card bg-slate-50 border-slate-100">
             <h3 class="font-bold text-slate-800 mb-2">Eligibility Note</h3>
             <p class="text-xs text-slate-500 leading-relaxed">
               {{ donor.eligibility.isEligible ? 'This donor has completed the mandatory 90-day rest period.' : donor.eligibility.reason }}
             </p>
             <div v-if="!donor.eligibility.isEligible && donor.eligibility.nextEligibleDate" class="mt-3 p-2 bg-white rounded border border-orange-100">
                <p class="text-[10px] text-orange-400 font-bold uppercase">Next Eligible Date</p>
                <p class="text-sm font-bold text-orange-600">{{ new Date(donor.eligibility.nextEligibleDate).toLocaleDateString() }}</p>
             </div>
          </div>
        </div>

        <!-- Main Content: History & Action -->
        <div class="md:col-span-2 space-y-6">
          <!-- Log Donation -->
          <div v-if="donor.eligibility.isEligible" class="card bg-red-50 border-red-100">
            <h3 class="font-bold text-red-900 mb-4">Log New Donation</h3>
            <form @submit.prevent="handleLogDonation" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <select v-model="logForm.campId" class="px-3 py-2 rounded-lg border border-red-200 text-sm outline-none focus:ring-2 focus:ring-red-500">
                  <option :value="null">No Specific Camp (Direct)</option>
                  <option v-for="camp in camps" :key="camp.id" :value="camp.id">{{ camp.name }}</option>
               </select>
               <input v-model="logForm.location" type="text" placeholder="Specific Location / Hospital" required class="px-3 py-2 rounded-lg border border-red-200 text-sm outline-none focus:ring-2 focus:ring-red-500">
               <input v-model.number="logForm.units" type="number" step="0.1" placeholder="Units (e.g. 1.0)" required class="px-3 py-2 rounded-lg border border-red-200 text-sm outline-none focus:ring-2 focus:ring-red-500">
               <select v-model="logForm.status" class="px-3 py-2 rounded-lg border border-red-200 text-sm outline-none focus:ring-2 focus:ring-red-500 bg-white">
                  <option value="DONATED">Successfully Donated</option>
                  <option value="NOT_DONATED">Not Donated / Other</option>
                  <option value="LOW_HB">Low HB (Hemoglobin)</option>
                  <option value="NOT_ELIGIBLE">Medical Unfit / Deferred</option>
               </select>
               <button type="submit" :disabled="logging" class="sm:col-span-2 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                 <span v-if="logging" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                 <span>Record Donation</span>
               </button>
            </form>
          </div>

          <!-- History -->
          <div class="card">
            <h3 class="font-bold text-slate-800 mb-6">Donation History</h3>
            <div v-if="donor.donations.length === 0" class="text-center py-12 text-slate-400">
               <p class="italic">No donation history found for this donor.</p>
            </div>
            <div v-else class="space-y-4">
               <div v-for="donation in donor.donations" :key="donation.id" class="group/item flex items-center justify-between p-4 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div class="flex items-center space-x-4">
                     <div class="p-2 bg-white rounded-lg text-slate-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                     </div>
                     <div>
                        <p class="text-sm font-bold text-slate-700">{{ donation.location }}</p>
                        <p class="text-xs text-slate-500">{{ new Date(donation.date).toLocaleDateString() }}</p>
                     </div>
                  </div>
                  <div class="flex items-center space-x-4">
                     <div class="text-right">
                        <p class="text-sm font-black text-red-600">{{ donation.units }} Units</p>
                        <p class="text-[10px] font-bold uppercase tracking-tight text-slate-400">{{ donation.status }}</p>
                     </div>
                     <!-- New Actions -->
                     <div class="flex flex-col space-y-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button @click="openEditDonationModal(donation)" class="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                           <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                        </button>
                        <button @click="handleDeleteDonation(donation.id)" class="p-1 text-slate-400 hover:text-red-600 transition-colors">
                           <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Donor Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
       <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">Edit Donor Profile</h2>
          <form @submit.prevent="handleUpdateDonor" class="space-y-6">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                   <input v-model="editForm.name" type="text" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Mobile</label>
                  <input v-model="editForm.mobile" type="tel" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
                </div>
                <div>
                   <label class="block text-sm font-medium text-slate-700 mb-1">Age</label>
                   <input v-model.number="editForm.age" type="number" required min="18" max="65" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
                </div>
                <div>
                   <label class="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                   <select v-model="editForm.gender" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                   </select>
                </div>
                <div>
                   <label class="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                   <select v-model="editForm.bloodGroup" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
                      <option v-for="bg in bloodGroups" :key="bg.value" :value="bg.value">{{ bg.label }}</option>
                   </select>
                </div>
                <div>
                   <label class="block text-sm font-medium text-slate-700 mb-1">State</label>
                   <select v-model="editForm.addressState" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
                      <option value="">Select State</option>
                      <option v-for="(districts, state) in INDIA_LOCATIONS" :key="state" :value="state">{{ state }}</option>
                   </select>
                </div>
                <div>
                   <label class="block text-sm font-medium text-slate-700 mb-1">District</label>
                   <select v-model="editForm.addressDistrict" required :disabled="!editForm.addressState" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none disabled:bg-slate-50">
                      <option value="">Select District</option>
                      <option v-for="district in editDistricts" :key="district" :value="district">{{ district }}</option>
                   </select>
                </div>
                <div>
                   <label class="block text-sm font-medium text-slate-700 mb-1">City</label>
                   <input v-model="editForm.addressCity" type="text" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                  <input v-model="editForm.pincode" type="text" pattern="\d{6}" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
                </div>
                <div class="md:col-span-2">
                   <label class="block text-sm font-medium text-slate-700 mb-1">Medical Conditions</label>
                   <textarea v-model="editForm.medicalConditions" rows="2" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none"></textarea>
                </div>
             </div>
             <div class="flex justify-end space-x-3 pt-6 border-t font-bold">
                <button type="button" @click="isEditModalOpen = false" class="px-6 py-2 text-slate-500">Cancel</button>
                <button type="submit" :disabled="updating" class="btn-primary min-w-[140px] flex justify-center items-center">
                   <span v-if="updating" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                   Save Changes
                </button>
             </div>
          </form>
       </div>
    </div>

    <!-- Edit Donation Modal -->
    <div v-if="isEditDonationModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
       <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">Edit Donation Entry</h2>
          <form @submit.prevent="handleUpdateDonation" class="space-y-4">
             <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Camp / Location</label>
                <input v-model="editDonationForm.location" type="text" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
             </div>
             <div class="grid grid-cols-2 gap-4">
                <div>
                   <label class="block text-sm font-medium text-slate-700 mb-1">Units (Blood)</label>
                   <input v-model.number="editDonationForm.units" type="number" step="0.1" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
                </div>
                <div>
                   <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
                   <select v-model="editDonationForm.status" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
                      <option value="DONATED">Donated</option>
                      <option value="NOT_DONATED">Not Donated</option>
                      <option value="DEFERRED">Deferred</option>
                   </select>
                </div>
             </div>
             <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Donation Date</label>
                <input v-model="editDonationForm.date" type="datetime-local" required class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none">
             </div>
             <div class="flex justify-end space-x-3 pt-6 border-t font-bold">
                <button type="button" @click="isEditDonationModalOpen = false" class="px-6 py-2 text-slate-500">Cancel</button>
                <button type="submit" :disabled="updatingDonation" class="btn-primary min-w-[140px] flex justify-center items-center">
                   <span v-if="updatingDonation" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                   Update Entry
                </button>
             </div>
          </form>
       </div>
    </div>
  </div>
</template>

<script setup>
import { formatBloodGroup } from '~/utils/blood-group'
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

const route = useRoute()
const donorId = route.params.id

const { data: response, pending, refresh } = await useFetch(`/api/donors/${donorId}`)
const donor = computed(() => response.value?.data)

const { data: campsResponse } = await useFetch('/api/camps')
const camps = computed(() => campsResponse.value?.data || [])

// Donation Logging
const logForm = ref({
  donorId: donorId,
  campId: null,
  location: '',
  units: 1,
  status: 'DONATED'
})

watch(() => logForm.value.campId, (newVal) => {
  if (newVal) {
    const selectedCamp = camps.value.find(c => c.id === newVal)
    if (selectedCamp) logForm.value.location = selectedCamp.location
  }
})

const logging = ref(false)

async function handleLogDonation() {
  logging.value = true
  try {
    const res = await $fetch('/api/donations/log', {
      method: 'POST',
      body: logForm.value
    })
    if (res.success) {
      logForm.value.location = ''
      refresh()
      alert('Donation recorded successfully!')
    }
  } catch (e) {
    alert(e.data?.statusMessage || 'Failed to record donation.')
  } finally {
    logging.value = false
  }
}

// Donor Management (Edit/Delete)
const isEditModalOpen = ref(false)
const updating = ref(false)
const editForm = ref({
  name: '',
  mobile: '',
  age: 18,
  gender: 'MALE',
  bloodGroup: 'O_POSITIVE',
  addressState: '',
  addressDistrict: '',
  addressCity: '',
  pincode: '',
  medicalConditions: ''
})

const editDistricts = computed(() => {
  if (!editForm.value.addressState) return []
  return INDIA_LOCATIONS[editForm.value.addressState] || []
})

watch(() => editForm.value.addressState, (newVal, oldVal) => {
  if (oldVal) editForm.value.addressDistrict = ''
})

function openEditModal() {
  const d = donor.value
  editForm.value = {
    name: d.name,
    mobile: d.mobile,
    age: d.age,
    gender: d.gender,
    bloodGroup: d.bloodGroup,
    addressState: d.addressState,
    addressDistrict: d.addressDistrict,
    addressCity: d.addressCity,
    pincode: d.pincode || '',
    medicalConditions: d.medicalConditions || ''
  }
  isEditModalOpen.value = true
}

async function handleUpdateDonor() {
  updating.value = true
  try {
    await $fetch(`/api/donors/${donorId}`, {
      method: 'PUT',
      body: editForm.value
    })
    isEditModalOpen.value = false
    refresh()
    alert('Donor profile updated successfully!')
  } catch (e) {
    alert(e.data?.statusMessage || 'Failed to update donor profile.')
  } finally {
    updating.value = false
  }
}

async function handleDeleteDonor() {
  if (!confirm('Are you sure you want to delete this donor? This will also remove their entire donation history. This action cannot be undone.')) return
  
  try {
    await $fetch(`/api/donors/${donorId}`, {
      method: 'DELETE'
    })
    alert('Donor deleted successfully.')
    navigateTo('/donors')
  } catch (e) {
    alert('Failed to delete donor.')
  }
}

// Donation Management (Edit/Delete)
const isEditDonationModalOpen = ref(false)
const updatingDonation = ref(false)
const selectedDonationId = ref(null)
const editDonationForm = ref({
  location: '',
  units: 1,
  status: 'DONATED',
  date: ''
})

function openEditDonationModal(donation) {
  selectedDonationId.value = donation.id
  editDonationForm.value = {
    location: donation.location,
    units: donation.units,
    status: donation.status,
    date: new Date(donation.date).toISOString().slice(0, 16)
  }
  isEditDonationModalOpen.value = true
}

async function handleUpdateDonation() {
  updatingDonation.value = true
  try {
    await $fetch(`/api/donations/${selectedDonationId.value}`, {
      method: 'PUT',
      body: editDonationForm.value
    })
    isEditDonationModalOpen.value = false
    refresh()
    alert('Donation record updated successfully!')
  } catch (e) {
    alert(e.data?.statusMessage || 'Failed to update donation record.')
  } finally {
    updatingDonation.value = false
  }
}

async function handleDeleteDonation(id) {
  if (!confirm('Are you sure you want to delete this donation record? This will affect the donor\'s last donation date. This action cannot be undone.')) return
  
  try {
    await $fetch(`/api/donations/${id}`, {
      method: 'DELETE'
    })
    refresh()
    alert('Donation record deleted and profile updated.')
  } catch (e) {
    alert('Failed to delete donation record.')
  }
}
</script>
