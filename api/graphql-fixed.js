const { ApolloServer, gql } = require('apollo-server-micro');
const { send } = require('micro');

const typeDefs = gql`
  type Query {
    health: String
    test: String
    users: [User]
    products: [Product]
  }
  type User { id: ID!, email: String!, role: String! }
  type Product { id: ID!, name: String!, price: Float!, description: String }
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  cacheControl: { defaultMaxAge: 0 }
});

const startServer = server.start ? server.start() : Promise.resolve();

module.exports = async (req, res) => {
  if (req.url === '/' && req.method === 'GET') { return send(res, 200, { status: 'OK', hint: 'Utilisez /graphql-fixed' }); }
  if (req.url === '/favicon.ico') { res.statusCode = 204; return res.end(); }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.statusCode = 200; return res.end(); }

  await startServer;
  const handler = server.createHandler({ path: '/graphql-fixed' });
  return handler(req, res);
};