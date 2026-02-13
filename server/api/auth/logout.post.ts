export default defineEventHandler(async (event) => {
    // sidebase-auth handles the client-side session destruction
    // We just return a success message here
    return {
        success: true,
        message: 'Logged out successfully'
    }
})
