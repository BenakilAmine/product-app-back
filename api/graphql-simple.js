const { ApolloServer, gql } = require('apollo-server');

// Schema GraphQL minimal
const typeDefs = gql`
  type Query {
    health: String
    test: String
  }
`;

const resolvers = {
  Query: {
    health: () => 'API GraphQL fonctionne',
    test: () => 'Test endpoint OK'
  }
};

// Configuration Apollo Server simplifiée
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: () => {
    console.log('🔍 Contexte GraphQL simple');
    return {};
  },
  formatError: (error) => {
    console.error('GraphQL Error:', error.message);
    return error;
  }
});

// Export pour Vercel
module.exports = server;