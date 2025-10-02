# 🚀 Guide de Déploiement Vercel - Résumé

## ❓ Question fréquente : Dois-je envoyer `dist/` sur Git ?

**Réponse : NON !** Le dossier `dist/` ne doit **jamais** être committé sur Git.

## ✅ Processus correct

### 1. Développement local
```bash
# Développement
npm run dev

# Test local
npm run build
npm start
```

### 2. Commit et push (sans dist/)
```bash
git add .
git commit -m "Fix Vercel deployment"
git push origin main
```

### 3. Déploiement automatique Vercel
- Vercel détecte le push
- Exécute `npm run vercel-build`
- Génère automatiquement `dist/`
- Déploie l'API

## 📁 Structure des fichiers

### Sur Git (votre repository) :
```
backend/
├── src/                  # Code source TypeScript ✅
├── api/
│   ├── index.js         # Point d'entrée Vercel ✅
│   └── package.json     # Dépendances API ✅
├── vercel.json          # Configuration Vercel ✅
├── .gitignore           # Exclut dist/ ✅
├── package.json         # Scripts de build ✅
└── README.md            # Documentation ✅
```

### Sur Vercel (après déploiement) :
```
/var/task/
├── src/                  # Code source (non utilisé)
├── dist/                 # Code compilé (généré par Vercel) ✅
├── api/
│   └── index.js         # Point d'entrée ✅
└── node_modules/        # Dépendances ✅
```

## 🔧 Configuration

### `.gitignore` (exclut dist/)
```gitignore
# compiled output
dist/
```

### `package.json` (script de build)
```json
{
  "scripts": {
    "vercel-build": "prisma generate && tsc"
  }
}
```

### `vercel.json` (configuration Vercel)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ]
}
```

## 🚀 Commandes de déploiement

### Option 1 : Via Git (recommandé)
```bash
git add .
git commit -m "Fix Vercel deployment"
git push origin main
```

### Option 2 : Via Vercel CLI
```bash
npm run build
vercel --prod
```

### Option 3 : Script automatique
```powershell
.\deploy-vercel.ps1
```

## 🧪 Test local
```powershell
.\test-local.ps1
```

## 🔑 Variables d'environnement Vercel
```
DATABASE_URL=postgresql://username:password@host:port/database?schema=public
JWT_SECRET=votre-secret-jwt-tres-securise-ici
NODE_ENV=production
```

## 📝 Résumé

✅ **À commiter sur Git :**
- Code source (`src/`)
- Configuration (`vercel.json`, `package.json`)
- Documentation (`README.md`)

❌ **À ne PAS commiter :**
- Dossier `dist/` (généré automatiquement)
- Fichiers `.env` (variables d'environnement)
- `node_modules/` (dépendances)

🎯 **Vercel s'occupe de :**
- Générer `dist/` automatiquement
- Installer les dépendances
- Déployer l'API
- Gérer les variables d'environnement