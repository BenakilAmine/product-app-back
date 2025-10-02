@echo off
echo 🚀 Déploiement Vercel - Backend GraphQL
echo.

echo 📦 Installation des dépendances...
call npm install

echo 🔨 Construction du projet...
call npm run build

echo 🗑️ Nettoyage du cache Vercel...
if exist .vercel rmdir /s /q .vercel

echo 🚀 Déploiement sur Vercel...
call vercel --prod --force

echo ✅ Déploiement terminé !
pause