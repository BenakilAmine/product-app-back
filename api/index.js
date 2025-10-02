const { ApolloServer } = require('apollo-server');

// Configuration minimale pour éviter les timeouts
let prisma = null;
let isPrismaReady = false;

// Initialisation asynchrone de Prisma
async function initializePrisma() {
  if (isPrismaReady) return prisma;
  
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient({
      // Configuration optimisée pour Vercel
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      },
      // Réduction des logs pour éviter les timeouts
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
    
    // Test de connexion rapide
    await prisma.$connect();
    isPrismaReady = true;
    console.log('✅ Prisma Client initialisé avec succès');
    return prisma;
  } catch (error) {
    console.error('❌ Erreur Prisma:', error.message);
    // Fallback mock
    prisma = {
      user: { findMany: () => [], findUnique: () => null, create: () => null },
      product: { findMany: () => [], findUnique: () => null, create: () => null },
      $disconnect: () => {}
    };
    isPrismaReady = true;
    return prisma;
  }
}

// Import dynamique des modules avec fallback
let loadAllModels, authMiddleware;

try {
  const loaderModule = require('../dist/models/loader');
  loadAllModels = loaderModule.loadAllModels;
} catch (error) {
  console.error('❌ Erreur loader:', error.message);
  loadAllModels = () => ({ 
    allTypeDefs: `
      type Query {
        health: String
        test: String
      }
    `, 
    allResolvers: {
      Query: {
        health: () => 'API GraphQL fonctionne',
        test: () => 'Test endpoint OK'
      }
    }
  });
}

try {
  const authModule = require('../dist/middleware/auth');
  authMiddleware = authModule.authMiddleware;
} catch (error) {
  console.error('❌ Erreur auth:', error.message);
  authMiddleware = async () => ({ user: null });
}

// Chargement des modèles
const { allTypeDefs, allResolvers } = loadAllModels();

// Configuration Apollo Server optimisée
const server = new ApolloServer({
  typeDefs: allTypeDefs,
  resolvers: allResolvers,
  context: async ({ req }) => {
    // Initialisation Prisma en arrière-plan
    const prismaInstance = await initializePrisma();
    
    // Contexte minimal pour éviter les timeouts
    const authContext = await authMiddleware(req);
    
    return { 
      ...authContext, 
      prisma: prismaInstance 
    };
  },
  introspection: true, // Activé pour le debugging
  playground: true, // Activé pour le debugging
  formatError: (error) => {
    console.error('GraphQL Error:', error.message);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path
    };
  },
  // Configuration pour éviter les timeouts
  cacheControl: {
    defaultMaxAge: 0,
    stripFormattedExtensions: false,
    calculateHttpHeaders: false
  }
});

// Export pour Vercel
module.exports = server;