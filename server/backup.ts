import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function exportData() {
  console.log('🚀 Iniciando backup de emergência...');

  const foods = await prisma.food.findMany();
  const logs = await prisma.dailyFoodLog.findMany();

  const data = {
    timestamp: new Date().toISOString(),
    foods,
    logs,
  };

  fs.writeFileSync('EMERGENCY_BACKUP.json', JSON.stringify(data, null, 2));

  console.log('✅ Arquivo EMERGENCY_BACKUP.json criado com sucesso!');
  await prisma.$disconnect();
}

exportData();
