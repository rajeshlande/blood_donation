<template>
  <div class="max-w-7xl mx-auto px-4 py-16">
    <div class="max-w-3xl mx-auto text-center mb-16">
       <div class="inline-block p-3 bg-red-50 text-red-600 rounded-2xl mb-6">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
       </div>
       <h1 class="text-5xl font-black text-slate-900 mb-6 font-display tracking-tight">Saving Lives through <span class="text-red-600 underline decoration-red-200 underline-offset-8">Digital Connection</span>.</h1>
       <p class="text-xl text-slate-500 leading-relaxed">RaktKosh India is more than just a blood management platform; it's a nationwide movement to ensure that no life is lost due to the unavailability of blood.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
       <div class="card p-10 bg-slate-50 border-none">
          <h2 class="text-3xl font-bold text-slate-800 mb-4">Our Mission</h2>
          <p class="text-slate-600 leading-relaxed">To bridge the gap between voluntary blood donors and those in urgent need. By leveraging modern technology, we aim to organize donation camps effectively and provide real-time accessibility to blood inventory metrics across India.</p>
       </div>
       <div class="card p-10 bg-red-600 text-white shadow-xl shadow-red-100">
          <h2 class="text-3xl font-bold mb-4 text-white">Our Vision</h2>
          <p class="text-red-50 leading-relaxed font-medium">A future where blood donation is an integral part of every citizen's social responsibility, and our digital infrastructure makes the process as seamless as a single click.</p>
       </div>
    </div>

    <div class="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
       <h3 class="text-2xl font-bold text-slate-900 mb-8">Platform Principles</h3>
       <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div class="space-y-3">
             <div class="text-red-600 font-bold text-lg">100% Voluntary</div>
             <p class="text-sm text-slate-500">We believe in the power of selfless giving. Our platform is strictly for non-commercial voluntary donation.</p>
          </div>
          <div class="space-y-3 px-4 border-x border-slate-50">
             <div class="text-red-600 font-bold text-lg">Data Integrity</div>
             <p class="text-sm text-slate-500">Accurate eligibility tracking (90-day rule) ensures the safety of both donors and recipients.</p>
          </div>
          <div class="space-y-3">
             <div class="text-red-600 font-bold text-lg">Privacy First</div>
             <p class="text-sm text-slate-500">Your health data is secure and handled with the highest standards of confidentiality.</p>
          </div>
       </div>
    </div>
    
    <div class="mt-24">
       <h3 class="text-2xl font-bold text-slate-900 mb-8 text-center">Version History</h3>
       <div class="space-y-6 max-w-4xl mx-auto">
          <div v-for="entry in APP_CHANGELOG" :key="entry.version" class="card bg-white hover:border-red-100 transition-colors">
             <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                   <div class="flex items-center space-x-2 mb-1">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-600">v{{ entry.version }}</span>
                      <span class="text-xs font-bold text-slate-400 font-mono">{{ entry.date }}</span>
                   </div>
                   <h4 class="text-lg font-bold text-slate-800">{{ entry.title }}</h4>
                </div>
                <div :class="['px-2 py-1 rounded text-[10px] font-black uppercase ring-1 ring-inset', entry.type === 'feature' ? 'bg-green-50 text-green-700 ring-green-600/20' : entry.type === 'fix' ? 'bg-red-50 text-red-700 ring-red-600/20' : 'bg-blue-50 text-blue-700 ring-blue-600/20']">
                   {{ entry.type }}
                </div>
             </div>
             <ul class="space-y-2">
                <li v-for="detail in entry.details" :key="detail" class="flex items-start text-sm text-slate-500">
                   <svg class="w-4 h-4 text-red-400 mt-0.5 mr-2 shrink-0 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></svg>
                   {{ detail }}
                </li>
             </ul>
          </div>
       </div>
    </div>
    
    <div class="mt-20 text-center">
       <p class="text-slate-400 text-sm">RaktKosh India v{{ APP_VERSION }}</p>
    </div>
  </div>
</template>

<script setup>
import { APP_VERSION } from '~/utils/version'
import { APP_CHANGELOG } from '~/utils/changelog'
</script>
