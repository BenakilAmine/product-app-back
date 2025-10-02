import { gql } from 'apollo-server';
import { productTypeDefs, productResolvers } from './Product';

// Schéma de base GraphQL
const baseTypeDefs = gql`
  # Schéma de base
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

// Collecte automatique de tous les schémas et résolveurs
const allTypeDefs = [baseTypeDefs, productTypeDefs];

const allResolvers = {
  Query: {
    ...productResolvers.Query,
  },
  Mutation: {
    ...productResolvers.Mutation,
  },
};

export { allTypeDefs, allResolvers };