// Export centralisé des résolveurs Product
import { productQueries } from './queries';
import { productMutations } from './mutations';

// Combinaison des queries et mutations
export const productResolvers = {
  Query: {
    ...productQueries,
  },
  Mutation: {
    ...productMutations,
  },
};