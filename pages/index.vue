<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-white pt-16 pb-32 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="lg:grid lg:grid-cols-12 lg:gap-8">
          <div class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-4">
              #IndiaFightsTogether
            </span>
            <h1 class="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span class="block">Your Donation Can</span>
              <span class="block text-red-600">Save a Life Today.</span>
            </h1>
            <p class="mt-3 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              RaktKosh India connects voluntary blood donors with those in need. Join our community of lifesavers and help us ensure blood availability across the nation.
            </p>
            <div class="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div class="flex flex-col sm:flex-row gap-4">
                <NuxtLink to="/register" class="btn-primary flex items-center justify-center px-8 py-3 text-lg">
                  Become a Donor
                </NuxtLink>
                <NuxtLink to="/admin" class="flex items-center justify-center px-8 py-3 bg-white border border-slate-200 rounded-lg text-lg text-slate-700 font-semibold hover:bg-slate-50 transition-all">
                  Admin Access
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div class="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md overflow-hidden bg-red-50 p-8">
               <div class="flex items-center space-x-4 mb-6">
                 <div class="h-12 w-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">B+</div>
                 <div>
                   <p class="font-bold text-slate-800">Recent Donation</p>
                   <p class="text-xs text-slate-500">2 minutes ago in Delhi</p>
                 </div>
               </div>
               <div class="space-y-4">
                 <div class="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                   <div class="h-full bg-red-600 w-3/4"></div>
                 </div>
                 <div class="flex justify-between text-xs font-bold uppercase tracking-wider">
                   <span class="text-slate-400">Monthly Goal</span>
                   <span class="text-red-600">75% Achieved</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <div class="bg-red-600">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
          <div class="text-center text-white">
            <p class="text-3xl font-black">1.2k+</p>
            <p class="text-sm font-medium opacity-80 uppercase">Donors</p>
          </div>
          <div class="text-center text-white">
            <p class="text-3xl font-black">5.5k</p>
            <p class="text-sm font-medium opacity-80 uppercase">Lives Saved</p>
          </div>
          <div class="text-center text-white">
            <p class="text-3xl font-black">24/7</p>
            <p class="text-sm font-medium opacity-80 uppercase">Support</p>
          </div>
          <div class="text-center text-white">
            <p class="text-3xl font-black">28</p>
            <p class="text-sm font-medium opacity-80 uppercase">States Covered</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
