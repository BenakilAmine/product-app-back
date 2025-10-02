const { ApolloServer, gql } = require('apollo-server-micro');
const { send } = require('micro');

const typeDefs = gql`
  type Query { health: String, test: String }
`;

const resolvers = {
  Query: {
    health: () => 'API GraphQL fonctionne',
    test: () => 'Test endpoint OK'
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
  if (req.url === '/' && req.method === 'GET') { return send(res, 200, { status: 'OK', hint: 'Utilisez /graphql-simple' }); }
  if (req.url === '/favicon.ico') { res.statusCode = 204; return res.end(); }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.statusCode = 200; return res.end(); }

  await startServer;
  const handler = server.createHandler({ path: '/graphql-simple' });
  return handler(req, res);
};