import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testAuth() {
  console.log('\n=== Testing Authentication Flow ===\n');
  
  // 1. Check if admin user exists
  console.log('1. Checking admin user in database...');
  const user = await prisma.user.findUnique({
    where: { email: 'admin@raktkosh.in' }
  });
  
  if (user) {
    console.log('✅ Admin user found:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password: ${user.password}`);
  } else {
    console.log('❌ Admin user NOT found in database!');
  }
  
  // 2. Test login logic
  console.log('\n2. Testing login logic...');
  const testEmail = 'admin@raktkosh.in';
  const testPassword = 'admin123';
  
  if (user && user.password === testPassword) {
    console.log('✅ Password match successful');
    console.log('   Token would be: valid-session-token');
  } else {
    console.log('❌ Password mismatch!');
    if (user) {
      console.log(`   Expected: ${testPassword}`);
      console.log(`   Got: ${user.password}`);
    }
  }
  
  console.log('\n=== Test Complete ===\n');
}

testAuth()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
