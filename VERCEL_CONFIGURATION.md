# 🔧 Configuration Vercel - Guide Complet

## ❌ Problème identifié

L'erreur `Cannot find module '../dist/models/loader'` indique que Vercel ne génère pas le dossier `dist/` automatiquement.

## ✅ Solutions à appliquer

### 1. Configuration Vercel Dashboard

Allez dans le dashboard Vercel de votre projet :

1. **Settings** → **General**
2. **Build & Development Settings**
3. **Build Command** : `npm run vercel-build`
4. **Output Directory** : `dist`
5. **Install Command** : `npm install`

### 2. Variables d'environnement Vercel

Dans **Settings** → **Environment Variables**, ajoutez :

```
DATABASE_URL=postgresql://username:password@host:port/database?schema=public
JWT_SECRET=votre-secret-jwt-tres-securise-ici
NODE_ENV=production
```

### 3. Configuration `vercel.json`

```json
{
  "version": 2,
  "buildCommand": "npm run vercel-build",
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
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 4. Script de build optimisé

```json
{
  "scripts": {
    "vercel-build": "prisma generate && tsc && echo 'Build completed successfully'"
  }
}
```

## 🚀 Étapes de déploiement

### Étape 1 : Configuration locale
```bash
# 1. Vérifier que le build fonctionne
npm run build

# 2. Tester localement
npm start
```

### Étape 2 : Configuration Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. **Settings** → **General**
4. Configurez les paramètres de build
5. Ajoutez les variables d'environnement

### Étape 3 : Déploiement
```bash
# Option 1 : Via Git
git add .
git commit -m "Fix Vercel build configuration"
git push origin main

# Option 2 : Via Vercel CLI
vercel --prod
```

## 🔍 Vérification du déploiement

### 1. Logs de build Vercel
- Allez dans **Deployments**
- Cliquez sur le dernier déploiement
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

## 🛠️ Dépannage

### Si le build échoue :
1. Vérifiez les logs Vercel
2. Vérifiez que `prisma generate` fonctionne
3. Vérifiez que `tsc` compile correctement

### Si l'API ne répond pas :
1. Vérifiez les variables d'environnement
2. Vérifiez que `dist/` est généré
3. Vérifiez les logs d'exécution

### Si les modules ne sont pas trouvés :
1. Vérifiez que `dist/` est inclus dans le déploiement
2. Vérifiez que le build s'exécute avant le déploiement
3. Vérifiez la configuration des routes

## 📝 Checklist de déploiement

- [ ] Configuration Vercel Dashboard
- [ ] Variables d'environnement configurées
- [ ] Script `vercel-build` fonctionne localement
- [ ] Fichier `vercel.json` correct
- [ ] Build s'exécute sur Vercel
- [ ] Dossier `dist/` généré
- [ ] API répond correctement
- [ ] GraphQL fonctionne

## 🎯 Résumé

Le problème principal est que Vercel ne génère pas automatiquement le dossier `dist/`. Il faut :

1. **Configurer Vercel** pour exécuter `npm run vercel-build`
2. **Ajouter les variables d'environnement** nécessaires
3. **Vérifier les logs** de build et d'exécution
4. **Tester l'API** après déploiement