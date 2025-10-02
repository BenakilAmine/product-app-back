import { Product } from '../types';
import { Context } from '../../../types';

// Queries spécifiques au modèle Product
export const productQueries = {
  // Récupère tous les produits (publique - accessible à tous)
  products: async (_: unknown, __: unknown, { prisma }: Context): Promise<Product[]> => {
    try {
      const products = await prisma.product.findMany({
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      console.log('🔍 Resolver products (public) - products:', products);
      return products;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw new Error('Impossible de récupérer les produits');
    }
  },

  // Récupère les produits pour l'admin (avec filtrage par utilisateur)
  adminProducts: async (_: unknown, __: unknown, { prisma, user }: Context): Promise<Product[]> => {
    try {
      // Vérifier l'authentification
      if (!user) {
        throw new Error('Authentification requise pour voir les produits admin');
      }

      const where = user.role === 'SUPER_ADMIN' ? undefined : { userId: user.id };

      const products = await prisma.product.findMany({
        where,
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      console.log('🔍 Resolver adminProducts - products:', products);
      console.log('🔍 Resolver adminProducts - user:', user);
      return products;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits admin:', error);
      throw new Error('Impossible de récupérer les produits admin');
    }
  },

  // Récupère un produit par ID (publique - accessible à tous)
  product: async (_: unknown, { id }: { id: string }, { prisma }: Context): Promise<Product | null> => {
    try {
      const product = await prisma.product.findFirst({
        where: { 
          id: parseInt(id)
        },
        include: {
          user: true, // Inclure les données de l'utilisateur
        },
      });
      return product;
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      throw new Error('Impossible de récupérer le produit');
    }
  },

  // Récupère un produit par ID pour l'admin (avec vérification de propriété)
  adminProduct: async (_: unknown, { id }: { id: string }, { prisma, user }: Context): Promise<Product | null> => {
    try {
      // Vérifier l'authentification
      if (!user) {
        throw new Error('Authentification requise pour voir le produit admin');
      }

      const product = await prisma.product.findFirst({
        where: { 
          id: parseInt(id),
          userId: user.id // Vérifier que le produit appartient à l'utilisateur
        },
        include: {
          user: true, // Inclure les données de l'utilisateur
        },
      });
      return product;
    } catch (error) {
      console.error('Erreur lors de la récupération du produit admin:', error);
      throw new Error('Impossible de récupérer le produit admin');
    }
  },
};