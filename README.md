# Backend - Product App

API GraphQL avec Apollo Server, Prisma et PostgreSQL pour la gestion de produits avec authentification JWT.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- PostgreSQL
- npm ou yarn

### Installation
```bash
npm install
```

### Configuration
1. Copiez `env.example` vers `.env`
2. Configurez votre base de données PostgreSQL
3. Configurez le JWT_SECRET dans `.env`
4. Lancez les migrations Prisma

```bash
npm run prisma:migrate
```

### Démarrage
```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

## 📚 API GraphQL

### Endpoints
- **GraphQL** : `http://localhost:4000/graphql`
- **Playground** : `http://localhost:4000/graphql` (développement)

### Authentification
- `signup(input)` - Créer un compte utilisateur
- `login(input)` - Se connecter
- `me` - Récupérer l'utilisateur connecté

### Queries disponibles (authentification requise)
- `products` - Liste des produits de l'utilisateur
- `product(id)` - Détail d'un produit

### Mutations disponibles (authentification requise)
- `createProduct(input)` - Créer un produit
- `updateProduct(id, input)` - Modifier un produit
- `deleteProduct(id)` - Supprimer un produit

## 🔐 Authentification

### Headers requis
```http
Authorization: Bearer <jwt_token>
```

### Exemple de requête
```graphql
mutation Signup {
  signup(input: {
    email: "user@example.com"
    password: "password123"
  }) {
    token
    user {
      id
      email
    }
  }
}
```

## 🗄️ Base de données

### Modèle User
```graphql
type User {
  id: ID!
  email: String!
  createdAt: String!
  updatedAt: String!
}
```

### Modèle Product
```graphql
type Product {
  id: ID!
  name: String!
  price: Float!
  createdAt: String!
  updatedAt: String!
  user: User!
}
```

## 🛠️ Scripts disponibles

- `npm run dev` - Démarrage en mode développement
- `npm run build` - Build de production
- `npm start` - Démarrage en production
- `npm run prisma:migrate` - Exécuter les migrations
- `npm run prisma:generate` - Générer le client Prisma
- `npm run prisma:studio` - Interface Prisma Studio
- `npm run lint` - Linter ESLint
- `npm run lint:fix` - Corriger automatiquement les erreurs de lint

## 📁 Structure du projet

```
src/
├── index.ts              # Point d'entrée du serveur
├── middleware/           # Middlewares
│   └── auth.ts          # Middleware d'authentification
├── models/              # Modèles GraphQL
│   ├── User/           # Modèle User
│   │   ├── index.ts
│   │   ├── schema.ts   # Schéma GraphQL
│   │   ├── types.ts    # Types TypeScript
│   │   └── resolvers/  # Résolveurs
│   ├── Product/        # Modèle Product
│   │   ├── index.ts
│   │   ├── schema.ts   # Schéma GraphQL
│   │   ├── types.ts    # Types TypeScript
│   │   └── resolvers/  # Résolveurs
│   └── loader.ts       # Chargeur de modèles
├── utils/              # Utilitaires
│   └── auth.ts         # Fonctions d'authentification
└── types/              # Types globaux
    └── index.ts
```

## 🔧 Configuration

### Variables d'environnement
- `DATABASE_URL` - URL de connexion PostgreSQL
- `DIRECT_URL` - URL directe PostgreSQL
- `PORT` - Port du serveur (défaut: 4000)
- `JWT_SECRET` - Clé secrète pour JWT
- `NODE_ENV` - Environnement (development/production)

### Base de données
Le projet utilise Prisma comme ORM avec PostgreSQL. Les migrations sont gérées automatiquement.

## 📝 Développement

### Ajouter un nouveau modèle
1. Créer un dossier dans `src/models/`
2. Suivre la structure existante (schema, types, resolvers)
3. Ajouter le modèle dans `loader.ts`

### Bonnes pratiques
- Utiliser TypeScript strict
- Séparer les responsabilités (schema, types, resolvers)
- Gérer les erreurs proprement
- Documenter le code
- Sécuriser les opérations avec l'authentification

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt (12 rounds)
- JWT signé avec clé secrète
- Middleware d'authentification sur toutes les opérations sensibles
- Validation des données d'entrée
- Gestion des erreurs sécurisée