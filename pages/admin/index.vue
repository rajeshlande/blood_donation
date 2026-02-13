<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p class="text-slate-500">Real-time monitoring of blood donation activities across India.</p>
      </div>
      <div class="flex space-x-3">
        <button @click="refresh" class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          <span>Refresh Data</span>
        </button>
        <NuxtLink to="/register" class="btn-primary">Add New Donor</NuxtLink>
      </div>
    </div>

    <div v-if="pending" class="flex justify-center py-24">
      <span class="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></span>
    </div>

    <div v-else-if="stats" class="space-y-8">
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="card bg-red-50 border-red-100">
          <p class="text-red-600 text-sm font-semibold uppercase tracking-wider">Total Donors</p>
          <h3 class="text-4xl font-black text-red-900 mt-1">{{ stats.totalDonors }}</h3>
        </div>
        <div class="card bg-green-50 border-green-100">
          <p class="text-green-600 text-sm font-semibold uppercase tracking-wider">Eligible Now</p>
          <h3 class="text-4xl font-black text-green-900 mt-1">{{ stats.eligibleCount }}</h3>
        </div>
        <div class="card bg-blue-50 border-blue-100">
          <p class="text-blue-600 text-sm font-semibold uppercase tracking-wider">Total Donations</p>
          <h3 class="text-4xl font-black text-blue-900 mt-1">{{ stats.monthlyStats.reduce((acc, curr) => acc + curr.count, 0) }}</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Monthly Trends (Simplified Bar Chart) -->
        <div class="lg:col-span-2 card">
          <h3 class="text-lg font-bold text-slate-800 mb-6 font-display">Donation Trends (Last 6 Months)</h3>
          <div class="h-64 flex items-end justify-between space-x-2">
            <div v-for="item in stats.monthlyStats" :key="item.month" class="group flex flex-col items-center flex-1">
              <div class="w-full bg-red-100 rounded-t-lg transition-all group-hover:bg-red-400 relative" 
                   :style="{ height: `${(item.count / maxMonthlyCount) * 100}%` }">
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ item.count }}
                </span>
              </div>
              <p class="text-[10px] text-slate-400 mt-2 rotate-45 origin-left">{{ item.month }}</p>
            </div>
          </div>
        </div>

        <!-- Blood Group Distribution -->
        <div class="card">
          <h3 class="text-lg font-bold text-slate-800 mb-6">Blood Group Inventory</h3>
          <div class="space-y-4">
            <div v-for="bg in stats.bloodGroupStats" :key="bg.group" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">{{ formatBloodGroup(bg.group).split(' ')[0] }}</span>
                <span class="text-slate-600 font-medium">{{ formatBloodGroup(bg.group) }}</span>
              </div>
              <span class="text-slate-900 font-bold bg-slate-100 px-3 py-1 rounded-full text-sm">{{ bg.count }}</span>
            </div>
            <div v-if="stats.bloodGroupStats.length === 0" class="text-center text-slate-400 py-8 italic">No data yet</div>
          </div>
        </div>
      </div>

      <!-- Recent Donors Table -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-slate-800">Recent Registrations</h3>
          <NuxtLink to="/donors" class="text-red-600 text-sm font-semibold hover:underline">View All Donors</NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-slate-400 text-sm border-b border-slate-50 uppercase tracking-tight font-medium">
                <th class="pb-3 px-2">Name</th>
                <th class="pb-3 px-2">Group</th>
                <th class="pb-3 px-2">Mobile</th>
                <th class="pb-3 px-2">Location</th>
                <th class="pb-3 px-2">Action Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
               <tr v-if="stats.recentDonors.length === 0">
                 <td colspan="5" class="py-8 text-center text-slate-400 italic">No recent registrations found.</td>
               </tr>
               <tr v-for="donor in stats.recentDonors" :key="donor.id" @click="navigateTo(`/donors/${donor.id}`)" class="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td class="py-4 px-2 font-medium text-slate-700">{{ donor.name }}</td>
                  <td class="py-4 px-2">
                    <span class="bg-red-50 text-red-600 px-2.5 py-1 rounded text-xs font-bold">
                      {{ formatBloodGroup(donor.bloodGroup) }}
                    </span>
                  </td>
                  <td class="py-4 px-2 text-slate-500 text-sm">{{ donor.mobile }}</td>
                  <td class="py-4 px-2 text-slate-500 text-sm">{{ donor.addressCity }}, {{ donor.addressState }}</td>
                  <td class="py-4 px-2" @click.stop>
                    <select 
                      v-model="donor.status" 
                      @change="updateDonorStatus(donor.id, donor.status)"
                      class="text-[10px] font-black bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-red-500 transition-all uppercase tracking-tighter"
                    >
                      <option value="DONATED">Donated</option>
                      <option value="NOT_DONATED">Pending</option>
                      <option value="LOW_HB">Low HB</option>
                      <option value="NOT_ELIGIBLE">Unfit</option>
                    </select>
                  </td>
               </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatBloodGroup } from '~/utils/blood-group'

const { data: response, pending, refresh } = await useFetch('/api/admin/stats')

const stats = computed(() => response.value?.data)

const maxMonthlyCount = computed(() => {
  if (!stats.value?.monthlyStats) return 1
  return Math.max(...stats.value.monthlyStats.map(m => m.count), 1)
})

async function updateDonorStatus(id, status) {
  try {
    await $fetch(`/api/donors/${id}/status`, {
      method: 'PATCH',
      body: { status }
    })
    // Optional: show a small toast or just rely on the UI update
  } catch (e) {
    alert('Failed to update donor status.')
    refresh() // Revert UI if failed
  }
}
</script>
