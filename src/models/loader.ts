import { gql } from 'apollo-server';
import { productTypeDefs, productResolvers } from './Product';
import { userTypeDefs, userResolvers } from './User';

// Interface pour un module de modèle
interface ModelModule {
  typeDefs: any;
  resolvers: {
    Query?: Record<string, any>;
    Mutation?: Record<string, any>;
  };
}

// Liste des modules de modèles
const modelModules: ModelModule[] = [
  { typeDefs: userTypeDefs, resolvers: userResolvers },
  { typeDefs: productTypeDefs, resolvers: productResolvers },
  // Ajoutez d'autres modèles ici à l'avenir
  // { typeDefs: orderTypeDefs, resolvers: orderResolvers },
];

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

// Fonction pour charger automatiquement tous les modèles
export function loadAllModels() {
  console.log('🔄 Chargement des modèles...');
  
  // Collecte de tous les schémas
  const allTypeDefs = [baseTypeDefs, ...modelModules.map(module => module.typeDefs)];

  // Collecte de tous les résolveurs
  const allResolvers = {
    Query: {},
    Mutation: {},
  };

  // Fusion des résolveurs de tous les modules
  modelModules.forEach((module, index) => {
    console.log(`📦 Chargement du module ${index + 1}:`, {
      hasQuery: !!module.resolvers.Query,
      hasMutation: !!module.resolvers.Mutation,
      queryKeys: module.resolvers.Query ? Object.keys(module.resolvers.Query) : [],
      mutationKeys: module.resolvers.Mutation ? Object.keys(module.resolvers.Mutation) : []
    });
    
    if (module.resolvers.Query) {
      Object.assign(allResolvers.Query, module.resolvers.Query);
    }
    if (module.resolvers.Mutation) {
      Object.assign(allResolvers.Mutation, module.resolvers.Mutation);
    }
  });

  console.log('✅ Résolveurs finaux chargés:', {
    queryKeys: Object.keys(allResolvers.Query),
    mutationKeys: Object.keys(allResolvers.Mutation)
  });

  return { allTypeDefs, allResolvers };
}

// Export des modules individuels pour un accès direct si nécessaire
export { userTypeDefs, userResolvers } from './User';
export { productTypeDefs, productResolvers } from './Product';