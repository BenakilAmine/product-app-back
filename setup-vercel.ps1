Write-Host "🔧 Configuration Vercel - Backend GraphQL" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Étapes de configuration Vercel :" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Allez sur https://vercel.com" -ForegroundColor Cyan
Write-Host "2. Sélectionnez votre projet" -ForegroundColor Cyan
Write-Host "3. Settings → General" -ForegroundColor Cyan
Write-Host "4. Build & Development Settings :" -ForegroundColor Cyan
Write-Host "   - Build Command: npm run vercel-build" -ForegroundColor White
Write-Host "   - Output Directory: dist" -ForegroundColor White
Write-Host "   - Install Command: npm install" -ForegroundColor White
Write-Host ""
Write-Host "5. Settings → Environment Variables :" -ForegroundColor Cyan
Write-Host "   - DATABASE_URL=postgresql://username:password@host:port/database?schema=public" -ForegroundColor White
Write-Host "   - JWT_SECRET=votre-secret-jwt-tres-securise-ici" -ForegroundColor White
Write-Host "   - NODE_ENV=production" -ForegroundColor White
Write-Host ""

Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

Write-Host "🔨 Test du build local..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build local réussi !" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Déploiement sur Vercel..." -ForegroundColor Yellow
    vercel --prod
} else {
    Write-Host "❌ Build local échoué ! Vérifiez les erreurs ci-dessus." -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Après configuration Vercel, testez votre API :" -ForegroundColor Cyan
Write-Host "   https://votre-projet.vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Vérifiez les logs Vercel pour confirmer que le build s'exécute." -ForegroundColor Cyan