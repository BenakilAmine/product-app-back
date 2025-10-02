# 🔧 Configuration Dashboard Vercel - Guide Complet

## ❌ Problème identifié

Le message d'avertissement indique que Vercel ignore vos paramètres de build du dashboard car vous avez une configuration `builds` dans votre `vercel.json`.

## ✅ Solution appliquée

J'ai supprimé la section `builds` de votre `vercel.json` pour permettre à Vercel d'utiliser les paramètres du dashboard.

## 🔧 Configuration Dashboard Vercel

### **Étape 1 : Accéder au Dashboard**
1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet `product-app-back`
3. Cliquez sur **"Settings"** → **"General"**

### **Étape 2 : Configurer les Build Settings**

Dans la section **"Build & Development Settings"** :

#### **Build Command**
- Cliquez sur **"Edit"** à côté de "Build Command"
- Entrez : `npm run vercel-build`
- Cliquez sur **"Save"**

#### **Output Directory**
- Cliquez sur **"Edit"** à côté de "Output Directory"
- Entrez : `dist`
- Cliquez sur **"Save"**

#### **Install Command**
- Cliquez sur **"Edit"** à côté de "Install Command"
- Entrez : `npm install`
- Cliquez sur **"Save"**

#### **Development Command**
- Cliquez sur **"Edit"** à côté de "Development Command"
- Entrez : `npm run dev`
- Cliquez sur **"Save"**

### **Étape 3 : Configurer les Variables d'Environnement**

1. Cliquez sur **"Environment Variables"** dans le menu de gauche
2. Ajoutez ces variables :

#### **Variable 1 : DATABASE_URL**
- **Name** : `DATABASE_URL`
- **Value** : `postgresql://username:password@host:port/database?schema=public`
- **Environment** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **"Save"**

#### **Variable 2 : JWT_SECRET**
- **Name** : `JWT_SECRET`
- **Value** : `votre-secret-jwt-tres-securise-ici`
- **Environment** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **"Save"**

#### **Variable 3 : NODE_ENV**
- **Name** : `NODE_ENV`
- **Value** : `production`
- **Environment** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez sur **"Save"**

### **Étape 4 : Configuration finale**

Votre configuration devrait ressembler à ceci :

```
Build & Development Settings:
├── Build Command: npm run vercel-build
├── Output Directory: dist
├── Install Command: npm install
└── Development Command: npm run dev

Environment Variables:
├── DATABASE_URL: postgresql://...
├── JWT_SECRET: votre-secret-jwt-tres-securise-ici
└── NODE_ENV: production
```

## 🚀 Déploiement

### **Option 1 : Via Git (recommandé)**
```bash
git add .
git commit -m "Remove builds config from vercel.json"
git push origin main
```

### **Option 2 : Redéploiement manuel**
1. Allez dans **"Deployments"**
2. Cliquez sur **"Redeploy"** sur le dernier déploiement
3. Sélectionnez **"Use existing Build Cache"** : ❌ (décochez)
4. Cliquez sur **"Redeploy"**

## 🔍 Vérification

### **1. Logs de build**
Dans les **"Build Logs"**, vous devriez maintenant voir :
```
Running "npm run vercel-build"
> prisma generate && tsc && echo 'Build completed successfully'
✔ Generated Prisma Client
Build completed successfully
```

### **2. Test de l'API**
```bash
# Test de l'API déployée
curl https://votre-projet.vercel.app
```

### **3. Requête GraphQL**
```graphql
query {
  products {
    id
    name
    price
  }
}
```

## 📝 Résumé des changements

✅ **Supprimé de `vercel.json` :**
- Section `builds`
- `buildCommand`

✅ **Configuration Dashboard :**
- Build Command : `npm run vercel-build`
- Output Directory : `dist`
- Install Command : `npm install`
- Variables d'environnement : DATABASE_URL, JWT_SECRET, NODE_ENV

✅ **Résultat attendu :**
- Vercel exécute `npm run vercel-build`
- Génère le dossier `dist/`
- Déploie l'API GraphQL
- Plus d'avertissement sur les paramètres de build ignorés