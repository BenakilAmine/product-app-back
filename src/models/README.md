# 🏗️ Architecture Modulaire des Modèles

Cette architecture permet d'organiser chaque modèle GraphQL dans son propre dossier avec tous ses fichiers associés.

## 📁 Structure

```
src/models/
├── Product/                 # Modèle Product
│   ├── types.ts            # Types TypeScript
│   ├── schema.ts           # Schéma GraphQL
│   ├── resolvers/          # Dossier des résolveurs
│   │   ├── queries.ts      # Queries GraphQL
│   │   ├── mutations.ts    # Mutations GraphQL
│   │   └── index.ts        # Export centralisé
│   └── index.ts            # Export centralisé
├── template/               # Template pour nouveaux modèles
│   ├── types.ts
│   ├── schema.ts
│   ├── resolvers/
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── index.ts
│   ├── index.ts
│   └── README.md
├── loader.ts               # Chargement automatique
└── README.md               # Cette documentation
```

## 🎯 Avantages

### ✅ **Séparation des responsabilités**
- Chaque modèle est autonome
- Types, schéma et résolveurs co-localisés
- Facile à maintenir et déboguer

### ✅ **Évolutivité**
- Ajout de nouveaux modèles sans impact
- Chargement automatique des modules
- Template prêt à l'emploi

### ✅ **Maintenabilité**
- Code organisé et lisible
- Réduction des conflits Git
- Tests unitaires par modèle

## 🚀 Comment ajouter un nouveau modèle

### 1. Créer le dossier
```bash
mkdir src/models/User
```

### 2. Copier les fichiers template
```bash
cp src/models/template/* src/models/User/
```

### 3. Adapter les noms
- Remplacer `ModelName` par `User`
- Remplacer `modelName` par `user`
- Adapter les types et champs

### 4. Ajouter dans loader.ts
```typescript
import { userTypeDefs, userResolvers } from './User';

const modelModules: ModelModule[] = [
  { typeDefs: productTypeDefs, resolvers: productResolvers },
  { typeDefs: userTypeDefs, resolvers: userResolvers }, // ← Nouveau
];
```

## 📋 Exemple : Modèle User

```typescript
// types.ts
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

// schema.ts
export const userTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
  }
  
  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }
`;

// resolvers.ts
export const userResolvers = {
  Query: {
    users: async (_, __, { prisma }) => {
      return await prisma.user.findMany();
    },
  },
};
```

## 🔧 Configuration

Le système de chargement automatique :
- Collecte tous les `typeDefs`
- Fusionne tous les `resolvers`
- Gère les conflits de noms
- Charge les modules à la demande

## 🎨 Bonnes pratiques

1. **Nommage cohérent** : `ModelName` → `modelName`
2. **Types stricts** : Éviter `any`, utiliser des interfaces
3. **Validation** : Valider les inputs dans les résolveurs
4. **Gestion d'erreurs** : Messages d'erreur explicites
5. **Documentation** : Commenter les fonctions complexes

---

*Architecture modulaire pour une codebase maintenable et évolutive* 🚀