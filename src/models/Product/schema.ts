import { gql } from 'apollo-server';

// Schéma GraphQL spécifique au modèle Product
export const productTypeDefs = gql`
  # Modèle Product
  type Product {
    id: ID!
    name: String!
    price: Float!
    createdAt: String!
    updatedAt: String!
    user: User!
  }

  # Input pour créer un produit
  input CreateProductInput {
    name: String!
    price: Float!
  }

  # Input pour mettre à jour un produit
  input UpdateProductInput {
    name: String
    price: Float
  }

  # Queries spécifiques aux produits
  extend type Query {
    # Récupère tous les produits (publique)
    products: [Product!]!
    
    # Récupère les produits pour l'admin (avec filtrage)
    adminProducts: [Product!]!
    
    # Récupère un produit par ID (publique)
    product(id: ID!): Product
    
    # Récupère un produit par ID pour l'admin (avec vérification de propriété)
    adminProduct(id: ID!): Product
  }

  # Mutations spécifiques aux produits
    extend type Mutation {
  createProduct(input: CreateProductInput!): Product!
  updateProduct(id: ID!, input: UpdateProductInput!): Product!
  deleteProduct(id: ID!): Boolean!
  bulkCreateProducts(inputs: [CreateProductInput!]!, ownerId: ID): [Product!]!  # SUPER_ADMIN
}
`;