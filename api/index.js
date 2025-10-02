const { ApolloServer } = require('apollo-server');
const { loadAllModels } = require('../dist/models/loader');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../dist/middleware/auth');

// Instance Prisma pour la base de données
const prisma = new PrismaClient();

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

// Export pour Vercel
module.exports = server.createHandler();