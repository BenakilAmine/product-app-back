const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

// Instance Prisma pour la base de données
const prisma = new PrismaClient();

// Import dynamique des modules compilés avec gestion d'erreur
let loadAllModels, authMiddleware;

try {
  const loaderModule = require('../dist/models/loader');
  loadAllModels = loaderModule.loadAllModels;
} catch (error) {
  console.error('❌ Erreur lors du chargement du loader:', error);
  // Fallback pour le développement
  loadAllModels = () => ({ 
    allTypeDefs: `
      type Query {
        health: String
      }
    `, 
    allResolvers: {
      Query: {
        health: () => 'API GraphQL fonctionne'
      }
    }
  });
}

try {
  const authModule = require('../dist/middleware/auth');
  authMiddleware = authModule.authMiddleware;
} catch (error) {
  console.error('❌ Erreur lors du chargement de l\'auth:', error);
  // Fallback pour le développement
  authMiddleware = async () => ({ user: null });
}

// Chargement automatique de tous les modèles
const { allTypeDefs, allResolvers } = loadAllModels();

// Configuration du serveur Apollo avec authentification
const server = new ApolloServer({
  typeDefs: allTypeDefs,
  resolvers: allResolvers,
  context: async ({ req }) => {
    console.log('🔍 Contexte Apollo Server - Headers:', req?.headers);
    console.log('🔍 Contexte Apollo Server - Authorization:', req?.headers?.authorization);
    
    // Appliquer le middleware d'authentification
    const authContext = await authMiddleware(req);
    
    const finalContext = { ...authContext, prisma };
    
    return finalContext;
  },
  introspection: process.env.NODE_ENV !== 'production',
  formatError: (error) => {
    console.error('Erreur GraphQL:', error);
    return error;
  },
});

// Export pour Vercel - Apollo Server v3
module.exports = server;