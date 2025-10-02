import { Context } from '../../../types';
import { CreateProductArgs, Product, UpdateProductResolver, DeleteProductResolver, BulkCreateProductsArgs } from '../types';

// Mutations spécifiques au modèle Product
const isSuperAdmin = (role?: string) => role === 'SUPER_ADMIN';
export const productMutations = {
  // Crée un nouveau produit
  createProduct: async (_: unknown, { input }: CreateProductArgs, { prisma, user }: Context) => {
    if (!user) throw new Error('Authentification requise');
    if (!input.name || input.name.trim().length === 0) throw new Error('Le nom du produit est requis');
    if (input.price < 0) throw new Error('Le prix doit être positif');
    return prisma.product.create({
      data: { name: input.name.trim(), price: input.price, userId: user.id }
    });
  },

  // Met à jour un produit
  updateProduct: async (_: unknown, { id, input }: { id: string; input: Partial<CreateProductArgs['input']> }, { prisma, user }: Context) => {
    if (!user) throw new Error('Authentification requise');
    const existing = await prisma.product.findUnique({ where: { id: parseInt(id) }, select: { userId: true } });
    if (!existing) throw new Error('Produit non trouvé');
    if (existing.userId !== user.id && !isSuperAdmin(user.role)) throw new Error('Action non autorisée');
    if (input.name !== undefined && (!input.name || input.name.trim().length === 0)) throw new Error('Le nom ne peut pas être vide');
    if (input.price !== undefined && input.price < 0) throw new Error('Le prix doit être positif');
    return prisma.product.update({
      where: { id: parseInt(id) },
      data: { ...(input.name && { name: input.name.trim() }), ...(input.price !== undefined && { price: input.price }) }
    });
  },

  // Supprime un produit
  deleteProduct: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
    if (!user) throw new Error('Authentification requise');
    const existing = await prisma.product.findUnique({ where: { id: parseInt(id) }, select: { userId: true } });
    if (!existing) throw new Error('Produit non trouvé');
    if (existing.userId !== user.id && !isSuperAdmin(user.role)) throw new Error('Action non autorisée');
    await prisma.product.delete({ where: { id: parseInt(id) } });
    return true;
  },
  bulkCreateProducts: async (_: unknown, { inputs, ownerId }: BulkCreateProductsArgs, { prisma, user }: Context) => {
    if (!user || !isSuperAdmin(user.role)) throw new Error('Accès réservé au SUPER_ADMIN');
    if (!inputs?.length) throw new Error('Liste vide');
    const targetUserId = ownerId ? parseInt(ownerId) : user.id;
    const data = inputs.map(i => {
      if (!i.name || i.name.trim().length === 0) throw new Error('Nom requis');
      if (i.price < 0) throw new Error('Prix positif requis');
      return { name: i.name.trim(), price: i.price, userId: targetUserId };
    });
    const created = await prisma.product.createMany({ data });
    // Retourner les entités créées (rechargées)
    return prisma.product.findMany({ where: { userId: targetUserId }, orderBy: { id: 'desc' }, take: data.length });
  }
};