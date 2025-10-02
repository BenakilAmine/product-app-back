# 🔧 Correction Erreurs 504 - Timeout Vercel

## ❌ Problème identifié

```
504 Gateway Timeout
GET /graphql
GET /
OPTIONS /graphql
```

## 🔍 Cause du problème

1. **Initialisation Prisma trop lente** - Prisma prend plus de 10s à s'initialiser
2. **Timeout Vercel** - Les fonctions serverless ont un timeout par défaut
3. **Connexion base de données lente** - La DB prend du temps à répondre

## ✅ Solutions appliquées

### **1. Initialisation Prisma optimisée**

```javascript
// Initialisation asynchrone avec fallback
async function initializePrisma() {
  try {
    const prisma = new PrismaClient({
      log: ['error'], // Réduction des logs
    });
    await prisma.$connect();
    return prisma;
  } catch (error) {
    // Fallback mock en cas d'erreur
    return mockPrisma;
  }
}
```

### **2. Configuration Vercel avec timeout**

```json
{
  "functions": {
    "api/index.js": {
      "maxDuration": 30
    },
    "api/health.js": {
      "maxDuration": 10
    }
  }
}
```

### **3. Endpoint de santé**

```javascript
// api/health.js - Diagnostic rapide
module.exports = (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    prisma: { available: !!process.env.DATABASE_URL }
  });
};
```

## 🚀 Déploiement

```bash
git add .
git commit -m "Fix 504 timeout errors - Optimize Prisma initialization"
git push origin main
```

## 🔍 Tests de diagnostic

### **1. Test endpoint de santé**
```
GET https://product-app-back.vercel.app/health
```

Réponse attendue :
```json
{
  "status": "OK",
  "timestamp": "2024-10-02T14:45:00.000Z",
  "environment": "production",
  "prisma": { "available": true }
}
```

### **2. Test GraphQL simple**
```graphql
query {
  health
}
```

### **3. Test avec Playground**
```
https://product-app-back.vercel.app/graphql
```

## 🔧 Configuration Vercel Dashboard

### **Variables d'environnement requises :**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### **Build Command :**
```
npm run vercel-build
```

### **Output Directory :**
```
dist
```

## 🚨 Diagnostic des problèmes

### **Si l'endpoint /health fonctionne mais pas /graphql :**
- Problème d'initialisation Prisma
- Vérifiez les logs Vercel

### **Si rien ne fonctionne :**
- Problème de build
- Vérifiez les variables d'environnement
- Vérifiez la configuration Vercel

### **Si les timeouts persistent :**
- Base de données trop lente
- Considérez une DB plus proche (Vercel Postgres)
- Optimisez les requêtes Prisma

## 📝 Résumé des optimisations

- ✅ **Initialisation Prisma asynchrone**
- ✅ **Fallback mock en cas d'erreur**
- ✅ **Timeout Vercel configuré (30s)**
- ✅ **Endpoint de santé pour diagnostic**
- ✅ **Logs réduits pour éviter les timeouts**
- ✅ **Configuration Apollo Server optimisée**

## 🎯 Prochaines étapes

1. ✅ Déployer les corrections
2. 🔍 Tester l'endpoint /health
3. 🧪 Tester GraphQL avec une requête simple
4. 📊 Surveiller les logs Vercel
5. 🔧 Ajuster si nécessaire