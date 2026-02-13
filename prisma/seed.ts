import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@raktkosh.in'
    const password = 'admin123' // Storing plain for this specific dev request (POC)

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password,
            role: 'ADMIN',
            name: 'RaktKosh Admin'
        },
        create: {
            email,
            password,
            name: 'RaktKosh Admin',
            role: 'ADMIN'
        }
    })

    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
