const { ApolloServer, gql } = require('apollo-server');

// Schema GraphQL minimal sans Prisma
const typeDefs = gql`
  type Query {
    health: String
    test: String
    users: [User]
    products: [Product]
  }
  
  type User {
    id: ID!
    email: String!
    role: String!
  }
  
  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
  }
`;

const resolvers = {
  Query: {
    health: () => 'API GraphQL fonctionne',
    test: () => 'Test endpoint OK',
    users: () => [
      { id: '1', email: 'test@example.com', role: 'USER' },
      { id: '2', email: 'admin@example.com', role: 'ADMIN' }
    ],
    products: () => [
      { id: '1', name: 'Produit 1', price: 29.99, description: 'Description produit 1' },
      { id: '2', name: 'Produit 2', price: 49.99, description: 'Description produit 2' }
    ]
  }
};

// Configuration Apollo Server optimisée pour Vercel
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    console.log('🔍 Contexte GraphQL - Headers:', req?.headers);
    return {
      // Contexte minimal sans Prisma pour éviter les timeouts
      user: null,
      timestamp: new Date().toISOString()
    };
  },
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
    defaultMaxAge: 0
  }
});

// Export pour Vercel
module.exports = server;