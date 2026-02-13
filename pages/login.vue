<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-900 font-display">Admin Login</h1>
        <p class="text-slate-500 text-sm mt-1">Access RaktKosh administrative tools.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input v-model="email" type="email" required class="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-red-500" placeholder="admin@raktkosh.in">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input v-model="password" type="password" required class="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-red-500" placeholder="••••••••">
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full py-3 flex items-center justify-center space-x-2">
          <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
          <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
        </button>
      </form>

      <div class="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100 italic">
        <p class="text-xs text-slate-400 text-center">Demo Credentials:</p>
        <p class="text-xs text-slate-600 text-center font-mono">admin@raktkosh.in / admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { signIn, status } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    const result = await signIn({ email: email.value, password: password.value }, { callbackUrl: '/admin', redirect: true })
  } catch (e) {
    alert('Invalid credentials. Please use the demo credentials provided below.')
  } finally {
    loading.value = false
  }
}
</script>
