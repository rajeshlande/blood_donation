export default defineNuxtRouteMiddleware((to, from) => {
    // Simple client-side check for demonstration
    if (process.client) {
        const user = localStorage.getItem('auth_user')
        if (!user && to.path.startsWith('/admin')) {
            return navigateTo('/login')
        }
    }
})
