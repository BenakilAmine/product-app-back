import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { loadAllModels } from './models/loader';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './middleware/auth';

// Instance Prisma pour la base de données
export const prisma = new PrismaClient();

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
    // console.log('🔍 Contexte final:', finalContext);
    
    return finalContext;
  },
  introspection: process.env.NODE_ENV !== 'production',
  // playground: process.env.NODE_ENV !== 'production',
  formatError: (error) => {
    console.error('Erreur GraphQL:', error);
    return error;
  },
});

// Démarrage du serveur
const port = process.env.PORT || 4000;

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Serveur GraphQL démarré sur ${url}`);
  console.log(`📊 Playground GraphQL disponible sur ${url}`);
  console.log(`🔍 Interface interactive pour tester vos requêtes GraphQL`);
  console.log(`🔐 Authentification JWT activée`);
  console.log(`📝 Essayez cette mutation : mutation { signup(input: { email: "test@example.com", password: "password123" }) { token user { id email } } }`);
});

// Gestion propre de l'arrêt du serveur
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await prisma.$disconnect();
  process.exit(0);
});