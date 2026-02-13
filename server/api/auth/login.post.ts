export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { email, password } = body

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (user && user.password === password) {
        // In production, we must use bcrypt.compare(password, user.password)
        // For this local dev setup, we are matching plain text as per the user's demo credentials
        const { password: _, ...userWithoutPassword } = user
        return {
            token: 'valid-session-token', // In a real app, sign a JWT here
            user: userWithoutPassword
        }
    }

    throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid credentials',
    })
})
