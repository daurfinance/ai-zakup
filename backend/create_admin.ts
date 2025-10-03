import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'Dauirzhan.abd97@ixcloud.com';
  const password = 'Azamat1993@';

  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    },
    create: {
      email,
      password: hashedPassword,
      phone: '+70000000000',
      binIin: '000000000000',
      role: 'admin',
      status: 'active',
      emailVerifiedAt: new Date(),
    },
  });

  console.log('Admin user created/updated:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

