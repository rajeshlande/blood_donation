<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Donor Directory</h1>
        <p class="text-slate-500">Search and filter voluntary blood donors across the region.</p>
      </div>
      <div class="flex flex-wrap gap-4 items-center w-full md:w-auto">
        <div class="flex bg-slate-100 p-1 rounded-xl">
           <button 
             @click="viewMode = 'grid'" 
             :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-all', viewMode === 'grid' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
           >
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
           </button>
           <button 
             @click="viewMode = 'list'" 
             :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-all', viewMode === 'list' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
           >
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
           </button>
        </div>
        <select v-model="filter.bloodGroup" class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500">
          <option value="">All Blood Groups</option>
          <option v-for="bg in bloodGroups" :key="bg.value" :value="bg.value">{{ bg.label }}</option>
        </select>
        <select v-model="filter.eligibility" class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500">
          <option value="">All Status</option>
          <option value="ELIGIBLE">Eligible Now</option>
          <option value="NOT_ELIGIBLE">On Wait Period</option>
        </select>
        <div class="flex items-center space-x-2 border-l pl-4 ml-4">
           <button @click="exportToExcel" class="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors title='Export to Excel'">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
           </button>
           <button @click="exportToPDF" class="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors title='Export to PDF'">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M9 9h1M9 13h6m-6 4h6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
           </button>
        </div>
      </div>
    </div>

    <div v-if="pending" class="flex justify-center py-24">
      <span class="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></span>
    </div>

    <!-- Grid View -->
    <div v-if="!pending && viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="donor in filteredDonors" :key="donor.id" class="card hover:border-red-200 transition-colors group">
        <div class="flex justify-between items-start mb-4">
          <div class="h-14 w-14 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-red-100 group-hover:scale-105 transition-transform">
            {{ formatBloodGroup(donor.bloodGroup) }}
          </div>
          <div class="flex flex-col items-end space-y-1">
            <span :class="[
              'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
              donor.eligibility.isEligible ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            ]">
              {{ donor.eligibility.isEligible ? 'Eligible' : 'Wait Period' }}
            </span>
            <span :class="[
              'px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ring-1 ring-inset',
              donor.status === 'DONATED' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 
              donor.status === 'LOW_HB' ? 'bg-red-50 text-red-700 ring-red-600/20' : 
              donor.status === 'NOT_ELIGIBLE' ? 'bg-slate-50 text-slate-700 ring-slate-600/20' : 'bg-slate-50 text-slate-400 ring-slate-200'
            ]">
               {{ donor.status === 'NOT_DONATED' ? 'Pending' : donor.status.replace('_', ' ') }}
            </span>
          </div>
        </div>
        
        <h3 class="text-xl font-bold text-slate-800">{{ donor.name }}</h3>
        <p class="text-slate-500 text-sm mb-4">{{ donor.addressCity }}, {{ donor.addressState }}</p>
        
        <div class="space-y-2 border-t pt-4">
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">Mobile</span>
            <span class="text-slate-700 font-medium">+91 {{ donor.mobile }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">Last Donation</span>
            <span class="text-slate-700 font-medium">{{ donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never' }}</span>
          </div>
        </div>

        <button @click="navigateTo(`/donors/${donor.id}`)" class="w-full mt-6 py-2 border border-slate-100 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-all">
          View Details
        </button>
      </div>
    </div>

    <!-- List View -->
    <div v-else-if="!pending && viewMode === 'list'" class="card p-0 overflow-hidden border-slate-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left" id="donors-table">
          <thead class="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-widest font-black">
            <tr>
              <th class="py-4 px-6">Donor Info</th>
              <th class="py-4 px-6">Associated Camp</th>
              <th class="py-4 px-6 text-center">Group</th>
              <th class="py-4 px-6 text-center">Desk Stage</th>
              <th class="py-4 px-6">Outcome / Reason</th>
              <th class="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="donor in filteredDonors" :key="donor.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="py-4 px-6">
                <p class="font-bold text-slate-800">{{ donor.name }}</p>
                <p class="text-[10px] text-slate-400 font-mono tracking-tight uppercase">+91 {{ donor.mobile }}</p>
              </td>
              <td class="py-4 px-6">
                 <p class="text-sm font-medium text-slate-600">{{ donor.registeredCamp?.name || '---' }}</p>
                 <p class="text-[10px] text-slate-400 uppercase tracking-tighter">{{ donor.registeredCamp?.location || '' }}</p>
              </td>
              <td class="py-4 px-6 text-center">
                <span class="inline-flex w-9 h-9 rounded-lg bg-red-600 text-white font-black text-xs items-center justify-center shadow-sm">
                  {{ formatBloodGroup(donor.bloodGroup) }}
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                  <span :class="[
                    'px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ring-1 ring-inset',
                    donor.status === 'DONATED' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 
                    donor.status === 'ELIGIBLE' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                    donor.status === 'SCREENED' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' : 
                    donor.status === 'NOT_DONATED' ? 'bg-red-50 text-red-700 ring-red-600/20' : 'bg-slate-50 text-slate-400 ring-slate-200'
                  ]">
                     {{ donor.status }}
                  </span>
              </td>
              <td class="py-4 px-6">
                 <div v-if="donor.status === 'DONATED'" class="text-xs font-bold text-slate-900 flex items-center">
                    <svg class="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    1 Unit Collected
                 </div>
                 <div v-else-if="donor.status === 'NOT_DONATED'" class="text-[10px] font-medium text-red-500">
                    {{ donor.latestScreening?.failureReason || donor.donations[0]?.failureReason || 'Failed Medical / Technical' }}
                 </div>
                 <div v-else class="text-[10px] text-slate-400 italic">In progress</div>
              </td>
              <td class="py-4 px-6 text-right">
                <button @click="navigateTo(`/donors/${donor.id}`)" class="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-red-600 transition-all shadow-sm">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!pending && filteredDonors.length === 0" class="py-24 text-center">
       <div class="inline-block p-4 bg-slate-50 rounded-full mb-4">
          <svg class="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
       </div>
       <h3 class="text-xl font-bold text-slate-800">No donors found</h3>
       <p class="text-slate-500">Try adjusting your filters to find more results.</p>
    </div>
  </div>
</template>

<script setup>
import { formatBloodGroup } from '~/utils/blood-group'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

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

const { data: response, pending } = await useFetch('/api/donors')
const donors = computed(() => response.value?.data || [])

const viewMode = ref('list') // Default to list for reports

const filter = ref({
  bloodGroup: '',
  eligibility: ''
})

const filteredDonors = computed(() => {
  return donors.value.filter(d => {
    const matchesGroup = !filter.value.bloodGroup || d.bloodGroup === filter.value.bloodGroup
    const matchesEligibility = !filter.value.eligibility || 
                               (filter.value.eligibility === 'ELIGIBLE' ? d.eligibility.isEligible : !d.eligibility.isEligible)
    return matchesGroup && matchesEligibility
  })
})

function exportToExcel() {
  const data = filteredDonors.value.map(d => ({
    'Donor Name': d.name,
    'Mobile': d.mobile,
    'Blood Group': formatBloodGroup(d.bloodGroup),
    'Lifecycle Status': d.status,
    'Associated Camp': d.registeredCamp?.name || '---',
    'Failure Reason': d.latestScreening?.failureReason || d.donations[0]?.failureReason || '',
    'City': d.addressCity,
    'Last Donation': d.lastDonationDate ? new Date(d.lastDonationDate).toLocaleDateString() : 'Never'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "RaktKosh_Donors");
  XLSX.writeFile(workbook, `RaktKosh_Compliance_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
}

function exportToPDF() {
  const doc = new jsPDF('l', 'mm', 'a4'); // Landscape
  const tableData = filteredDonors.value.map(d => [
    d.name,
    d.registeredCamp?.name || '---',
    formatBloodGroup(d.bloodGroup),
    d.status,
    d.latestScreening?.failureReason || d.donations[0]?.failureReason || '---',
    d.mobile,
    d.lastDonationDate ? new Date(d.lastDonationDate).toLocaleDateString() : 'Never'
  ]);

  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38);
  doc.text("RaktKosh India - Donor Lifecycle Report", 14, 15);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()} | Camp Session Data`, 14, 22);

  doc.autoTable({
    startY: 30,
    head: [['Name', 'Camp', 'Group', 'Status', 'Failure Reason', 'Mobile', 'Last Donation']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], fontSize: 8 },
    bodyStyles: { fontSize: 8 }
  });

  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
  }

  doc.save(`RaktKosh_Donor_Report_${new Date().toISOString().slice(0,10)}.pdf`);
}
</script>
