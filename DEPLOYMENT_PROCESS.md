# 🚀 Processus de Déploiement Vercel - Guide Complet

## ❓ Question : Dois-je envoyer le dossier `dist/` sur Git ?

**Réponse : NON !** Voici pourquoi et comment procéder correctement.

## ❌ Pourquoi ne PAS commiter `dist/`

1. **Fichiers générés** : Le dossier `dist/` contient du code JavaScript compilé à partir de TypeScript
2. **Taille du repository** : Cela augmente inutilement la taille de votre Git
3. **Conflits de merge** : Peut causer des conflits lors des merges
4. **Redondance** : Le code source est déjà dans `src/`
5. **Maintenance** : Doit être régénéré à chaque changement

## ✅ Solution : Génération automatique par Vercel

### 1. Configuration `.gitignore`
```gitignore
# compiled output
dist/
```

### 2. Script de build dans `package.json`
```json
{
  "scripts": {
    "vercel-build": "prisma generate && tsc"
  }
}
```

### 3. Processus automatique Vercel
1. **Git push** → Vercel détecte les changements
2. **Installation** → `npm install` (dépendances)
3. **Build** → `npm run vercel-build` (génère `dist/`)
4. **Déploiement** → Utilise `api/index.js` qui référence `dist/`

## 🔄 Workflow de déploiement

### Étape 1 : Développement local
```bash
# Développement
npm run dev

# Test local
npm run build
npm start
```

### Étape 2 : Commit et push
```bash
# Ajouter les fichiers (sans dist/)
git add .
git commit -m "Fix Vercel deployment"
git push origin main
```

### Étape 3 : Déploiement automatique
- Vercel détecte le push
- Exécute `npm run vercel-build`
- Génère automatiquement `dist/`
- Déploie l'API

## 📁 Structure des fichiers

### Sur votre machine locale :
```
backend/
├── src/                  # Code source TypeScript
├── dist/                 # Code compilé (généré localement)
├── api/
│   └── index.js         # Point d'entrée Vercel
├── .gitignore           # Exclut dist/
└── package.json         # Scripts de build
```

### Sur Vercel (après déploiement) :
```
/var/task/
├── src/                  # Code source (non utilisé)
├── dist/                 # Code compilé (généré par Vercel)
├── api/
│   └── index.js         # Point d'entrée
└── node_modules/        # Dépendances
```

## 🔧 Configuration Vercel

### `vercel.json`
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

### `.vercelignore`
```gitignore
node_modules
.env*
*.log
.DS_Store
.vscode
.idea
src                    # Code source (non nécessaire sur Vercel)
prisma/migrations      # Migrations (non nécessaires)
```

## 🚀 Commandes de déploiement

### Option 1 : Via Git (recommandé)
```bash
# 1. Développement local
npm run dev

# 2. Test local
npm run build
npm start

# 3. Commit et push
git add .
git commit -m "Fix Vercel deployment"
git push origin main

# 4. Vercel déploie automatiquement
```

### Option 2 : Via Vercel CLI
```bash
# 1. Build local
npm run build

# 2. Déploiement direct
vercel --prod
```

## 🔍 Vérification du déploiement

### 1. Logs Vercel
- Allez dans le dashboard Vercel
- Vérifiez les logs de build
- Confirmez que `npm run vercel-build` s'exécute

### 2. Test de l'API
```bash
# Test de l'API déployée
curl https://votre-projet.vercel.app
```

### 3. Requête GraphQL
```graphql
query {
  products {
    id
    name
    price
  }
}
```

## 📝 Résumé

✅ **À faire :**
- Commiter le code source (`src/`)
- Commiter la configuration (`vercel.json`, `package.json`)
- Laisser Vercel générer `dist/` automatiquement

❌ **À ne pas faire :**
- Commiter le dossier `dist/`
- Commiter les fichiers générés
- Modifier manuellement les fichiers compilés

## 🎯 Avantages de cette approche

1. **Repository propre** : Seul le code source est versionné
2. **Déploiement automatique** : Vercel gère la compilation
3. **Pas de conflits** : Pas de fichiers générés dans Git
4. **Maintenance facile** : Un seul endroit pour le code source
5. **Performance** : Vercel optimise le build pour la production