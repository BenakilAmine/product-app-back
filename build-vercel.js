#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Début du build Vercel...');

try {
  // 1. Installer les dépendances
  console.log('📦 Installation des dépendances...');
  execSync('npm install', { stdio: 'inherit' });

  // 2. Générer Prisma Client
  console.log('🔧 Génération de Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 3. Compiler TypeScript
  console.log('⚙️ Compilation TypeScript...');
  execSync('npx tsc', { stdio: 'inherit' });

  // 4. Vérifier que le dossier dist existe
  if (!fs.existsSync('dist')) {
    throw new Error('Le dossier dist n\'a pas été créé');
  }

  // 5. Vérifier que Prisma Client existe
  const prismaClientPath = path.join('node_modules', '@prisma', 'client');
  if (!fs.existsSync(prismaClientPath)) {
    throw new Error('Prisma Client n\'a pas été généré');
  }

  console.log('✅ Build Vercel terminé avec succès !');
  console.log('📁 Dossier dist créé:', fs.existsSync('dist'));
  console.log('🔧 Prisma Client généré:', fs.existsSync(prismaClientPath));

} catch (error) {
  console.error('❌ Erreur lors du build:', error.message);
  process.exit(1);
}