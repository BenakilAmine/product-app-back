# 🚀 Guide de Déploiement Vercel - Backend GraphQL

## ❌ Problème résolu

L'erreur `Cannot find module '/var/task/__sapper__/build/server/server.js'` était causée par :
- Configuration Vercel incorrecte (cherchait Sapper au lieu d'Apollo Server)
- Cache Vercel avec ancienne configuration
- Structure de projet non optimisée pour Vercel

## ✅ Solution appliquée

### 1. Configuration Vercel nettoyée
- Supprimé `vercel.json` avec configuration Sapper
- Créé nouvelle configuration minimaliste
- Ajouté `now.json` pour compatibilité

### 2. Structure API optimisée
```
backend/
├── api/
│   ├── index.js          # Point d'entrée Vercel
│   └── package.json      # Dépendances API
├── dist/                 # Code compilé TypeScript
├── src/                  # Code source TypeScript
├── vercel.json          # Configuration Vercel
├── now.json             # Configuration alternative
└── .vercelignore        # Fichiers à ignorer
```

### 3. Scripts de déploiement
- `deploy-vercel.bat` : Script Windows
- `deploy-vercel.ps1` : Script PowerShell

## 🚀 Commandes de déploiement

### Option 1 : Script automatique
```bash
# Windows
deploy-vercel.bat

# PowerShell
.\deploy-vercel.ps1
```

### Option 2 : Commandes manuelles
```bash
# 1. Nettoyer le cache Vercel
rm -rf .vercel

# 2. Installer les dépendances
npm install

# 3. Construire le projet
npm run build

# 4. Déployer avec force
vercel --prod --force
```

### Option 3 : Via Git (recommandé)
```bash
# 1. Commiter les changements
git add .
git commit -m "Fix Vercel deployment - Remove Sapper config"

# 2. Pousser vers le repository
git push origin main

# 3. Vercel redéploiera automatiquement
```

## 🔑 Variables d'environnement requises

Configurez ces variables dans le dashboard Vercel :

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

## 🔧 Dépannage

### Si l'erreur Sapper persiste :
1. Supprimez complètement le projet Vercel
2. Recréez un nouveau projet
3. Redéployez avec la nouvelle configuration

### Si l'API ne répond pas :
1. Vérifiez les variables d'environnement
2. Vérifiez les logs Vercel
3. Testez localement avec `npm start`

## 📝 Notes importantes

- ✅ Configuration Sapper supprimée
- ✅ Structure API optimisée pour Vercel
- ✅ Cache Vercel nettoyé
- ✅ Scripts de déploiement créés
- ✅ Documentation complète