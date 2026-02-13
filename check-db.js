const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n=== USER TABLE ===');
  const users = await prisma.user.findMany();
  console.log(JSON.stringify(users, null, 2));

  console.log('\n=== DONOR TABLE ===');
  const donors = await prisma.donor.findMany();
  console.log(`Total donors: ${donors.length}`);
  if (donors.length > 0) {
    console.log(JSON.stringify(donors.slice(0, 3), null, 2));
  }

  console.log('\n=== CAMP TABLE ===');
  const camps = await prisma.camp.findMany();
  console.log(`Total camps: ${camps.length}`);
  if (camps.length > 0) {
    console.log(JSON.stringify(camps.slice(0, 3), null, 2));
  }

  console.log('\n=== SCREENING TABLE ===');
  const screenings = await prisma.screening.findMany();
  console.log(`Total screenings: ${screenings.length}`);

  console.log('\n=== DONATION TABLE ===');
  const donations = await prisma.donation.findMany();
  console.log(`Total donations: ${donations.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
