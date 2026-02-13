<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <div class="bg-red-600 p-2 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-1.909.48H8a2 2 0 01-2-2V7a2 2 0 012-2h3.08a4 4 0 011.909.48l.672.337a6 6 0 003.86.517l2.152-.43a2 2 0 001.078-3.418L17 3.5m-3 0V7a3 3 0 01-3 3H7" />
            </svg>
          </div>
          <span class="text-xl font-bold text-slate-900">RaktKosh <span class="text-red-600">India</span></span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/donors" class="nav-link">Reports</NuxtLink>
          <NuxtLink to="/register" class="nav-link">Public Registration</NuxtLink>
          
          <ClientOnly>
            <div v-if="status === 'authenticated'" class="flex items-center space-x-8">
              <NuxtLink to="/admin/screening" class="nav-link">Screening Desk</NuxtLink>
              <NuxtLink to="/admin/donation" class="nav-link">Donation Desk</NuxtLink>
              <NuxtLink to="/admin/camps" class="nav-link">Camps</NuxtLink>
              <NuxtLink to="/admin" class="btn-primary">Dashboard</NuxtLink>
              <div class="flex items-center space-x-4 pl-4 border-l">
                <span class="text-sm font-bold text-slate-700">{{ data?.user?.name }}</span>
                <button @click="signOut({ callbackUrl: '/' })" class="text-xs font-bold text-red-600 hover:underline">Logout</button>
              </div>
            </div>
            <div v-else>
              <NuxtLink to="/login" class="btn-primary">Admin Login</NuxtLink>
            </div>
          </ClientOnly>
        </div>

        <!-- Mobile Toggle -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>

      <!-- Mobile Drawer -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="isMenuOpen" class="md:hidden bg-white border-b border-slate-100 absolute w-full shadow-xl z-50">
          <div class="px-4 py-6 space-y-4">
            <NuxtLink to="/donors" class="mobile-nav-link">Find Donors</NuxtLink>
            <NuxtLink to="/register" class="mobile-nav-link">Register as Donor</NuxtLink>
            
            <hr class="border-slate-50">
            
            <ClientOnly>
              <div v-if="status === 'authenticated'" class="space-y-4">
                <NuxtLink to="/admin/screening" class="mobile-nav-link text-red-600">Screening Desk</NuxtLink>
                <NuxtLink to="/admin/donation" class="mobile-nav-link text-red-600">Donation Desk</NuxtLink>
                <NuxtLink to="/admin/camps" class="mobile-nav-link">Manage Camps</NuxtLink>
                <NuxtLink to="/admin" class="mobile-nav-link">Dashboard</NuxtLink>
                <div class="pt-4 border-t border-slate-50 flex items-center justify-between">
                   <span class="text-sm font-black text-slate-900">{{ data?.user?.name }}</span>
                   <button @click="signOut({ callbackUrl: '/' })" class="text-sm font-bold text-red-600">Logout</button>
                </div>
              </div>
              <div v-else>
                <NuxtLink to="/login" class="btn-primary w-full text-center block">Admin Login</NuxtLink>
              </div>
            </ClientOnly>
          </div>
        </div>
      </Transition>
    </header>

    <main class="flex-grow">
      <slot />
    </main>

    <footer class="bg-white border-t border-slate-200 py-12 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <span class="text-xl font-bold text-slate-900">RaktKosh India</span>
            <p class="text-slate-500 text-sm mt-1 mb-2">Dedicated to saving lives across the nation.</p>
            <div class="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
               v{{ APP_VERSION }}
            </div>
          </div>
          <div class="flex space-x-6 text-sm text-slate-500 font-medium">
            <NuxtLink to="/about" class="footer-link">About Us</NuxtLink>
            <NuxtLink to="/privacy" class="footer-link">Privacy Policy</NuxtLink>
            <NuxtLink to="/terms" class="footer-link">Terms of Service</NuxtLink>
            <NuxtLink to="/contact" class="footer-link">Contact Us</NuxtLink>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs">
          &copy; 2026 RaktKosh India. Built with pride for the nation.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { APP_VERSION } from '~/utils/version'

const { status, data, signOut } = useAuth()
const route = useRoute()
const isMenuOpen = ref(false)

// Close menu on navigation
watch(() => route.fullPath, () => {
  isMenuOpen.value = false
})
</script>

<style scoped>
.nav-link {
  @apply text-slate-600 hover:text-red-600 font-medium transition-colors;
}
.mobile-nav-link {
  @apply block text-lg font-bold text-slate-700 hover:text-red-600 transition-colors;
}
.footer-link {
  @apply hover:text-red-600 transition-colors;
}
</style>
