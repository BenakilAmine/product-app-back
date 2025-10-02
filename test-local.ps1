Write-Host "🧪 Test Local - Backend GraphQL" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

Write-Host "🔨 Construction du projet..." -ForegroundColor Yellow
npm run build

Write-Host "🚀 Démarrage du serveur local..." -ForegroundColor Yellow
Write-Host "   Le serveur sera disponible sur http://localhost:4000" -ForegroundColor Cyan
Write-Host "   Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Cyan
Write-Host ""

npm start