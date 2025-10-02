Write-Host "🚀 Déploiement Vercel - Backend GraphQL" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

Write-Host "🔨 Construction du projet..." -ForegroundColor Yellow
npm run build

Write-Host "🗑️ Nettoyage du cache Vercel..." -ForegroundColor Yellow
if (Test-Path ".vercel") {
    Remove-Item -Recurse -Force ".vercel"
}

Write-Host "🚀 Déploiement sur Vercel..." -ForegroundColor Yellow
vercel --prod --force

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green