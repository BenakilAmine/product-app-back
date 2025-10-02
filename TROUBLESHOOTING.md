# 🔧 Guide de Dépannage - Déploiement Vercel

## ❌ Problèmes résolus

### 1. Erreur Sapper
```
Cannot find module '/var/task/__sapper__/build/server/server.js'
```
**Solution :** Configuration Vercel nettoyée, suppression de `vercel-sapper`

### 2. Module dist manquant
```
Cannot find module '../dist/models/loader'
```
**Solution :** Suppression de `dist` du `.vercelignore`

### 3. Erreur createHandler
```
TypeError: server.createHandler is not a function
```
**Solution :** Utilisation d'Apollo Server Express avec Express

## ✅ Configuration finale

### Structure des fichiers
```
backend/
├── api/
│   ├── index.js          # Point d'entrée Vercel (Apollo Server + Express)
│   └── package.json      # Dépendances API
├── dist/                 # Code compilé TypeScript (inclus dans déploiement)
├── src/                  # Code source TypeScript
├── vercel.json          # Configuration Vercel
├── .vercelignore        # Fichiers à ignorer (sans dist)
└── deploy-vercel.ps1    # Script de déploiement
```

### Configuration Vercel (vercel.json)
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

### Point d'entrée API (api/index.js)
```javascript
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
// ... configuration Apollo Server avec Express
module.exports = startServer();
```

## 🚀 Commandes de déploiement

### Option 1 : Script automatique
```powershell
.\deploy-vercel.ps1
```

### Option 2 : Commandes manuelles
```bash
# 1. Nettoyer le cache
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue

# 2. Installer les dépendances
npm install

# 3. Construire le projet
npm run build

# 4. Déployer avec force
vercel --prod --force
```

### Option 3 : Via Git
```bash
git add .
git commit -m "Fix Vercel deployment - Apollo Server Express"
git push origin main
```

## 🔑 Variables d'environnement requises

Configurez dans le dashboard Vercel :
```
DATABASE_URL=postgresql://username:password@host:port/database?schema=public
JWT_SECRET=votre-secret-jwt-tres-securise-ici
NODE_ENV=production
```

## 🧪 Test du déploiement

### URL de test
- **Vercel** : `https://votre-projet.vercel.app`
- **GraphQL Playground** : `https://votre-projet.vercel.app` (en développement)

### Requête de test
```graphql
query {
  products {
    id
    name
    price
  }
}
```

## 🔍 Dépannage avancé

### Si l'erreur persiste :
1. **Supprimez complètement le projet Vercel**
2. **Recréez un nouveau projet**
3. **Redéployez avec la nouvelle configuration**

### Si l'API ne répond pas :
1. Vérifiez les variables d'environnement
2. Vérifiez les logs Vercel
3. Testez localement avec `npm start`

### Si les modules ne sont pas trouvés :
1. Vérifiez que `dist/` est inclus dans le déploiement
2. Vérifiez que `.vercelignore` n'exclut pas `dist/`
3. Reconstruisez avec `npm run build`

## 📝 Notes importantes

- ✅ Configuration Sapper supprimée
- ✅ Module `dist/` inclus dans le déploiement
- ✅ Apollo Server Express configuré correctement
- ✅ Scripts de déploiement créés
- ✅ Documentation complète