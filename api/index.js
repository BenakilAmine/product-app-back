const { ApolloServer } = require('apollo-server-micro');
const { send } = require('micro');

// Configuration minimale pour éviter les timeouts
let prisma = null;
let isPrismaReady = false;

// Initialisation asynchrone de Prisma
async function initializePrisma() {
  if (isPrismaReady) return prisma;
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient({
      datasources: {
        db: { url: process.env.DATABASE_URL }
      },
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
    });
    await prisma.$connect();
    isPrismaReady = true;
    console.log('✅ Prisma Client initialisé avec succès');
    return prisma;
  } catch (error) {
    console.error('❌ Erreur Prisma:', error.message);
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
      type Query { health: String, test: String }
    `,
    allResolvers: { Query: { health: () => 'API GraphQL fonctionne', test: () => 'Test endpoint OK' } }
  });
}

try {
  const authModule = require('../dist/middleware/auth');
  authMiddleware = authModule.authMiddleware;
} catch (error) {
  console.error('❌ Erreur auth:', error.message);
  authMiddleware = async () => ({ user: null });
}

const { allTypeDefs, allResolvers } = loadAllModels();

const server = new ApolloServer({
  typeDefs: allTypeDefs,
  resolvers: allResolvers,
  context: async ({ req }) => {
    const prismaInstance = await initializePrisma();
    const authContext = await authMiddleware(req);
    return { ...authContext, prisma: prismaInstance };
  },
  introspection: true,
  playground: true,
  cacheControl: { defaultMaxAge: 0 }
});

const startServer = server.start ? server.start() : Promise.resolve();

module.exports = async (req, res) => {
  // Réponses rapides pour éviter 504 sur routes non GraphQL
  if (req.url === '/' && req.method === 'GET') {
    return send(res, 200, { status: 'OK', service: 'GraphQL API', hint: 'Utilisez /graphql' });
  }
  if (req.url === '/favicon.ico') {
    res.statusCode = 204; return res.end();
  }

  // Autoriser CORS basique pour Playground/tests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.statusCode = 200; return res.end(); }

  await startServer;
  const handler = server.createHandler({ path: '/graphql' });
  return handler(req, res);
};