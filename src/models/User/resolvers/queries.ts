import { PrismaClient } from '@prisma/client';
import { AuthContext } from '../../../utils/auth';

const prisma = new PrismaClient();

/**
 * Query pour récupérer l'utilisateur connecté
 * @param parent - Parent resolver
 * @param args - Arguments (aucun)
 * @param context - Contexte GraphQL avec utilisateur authentifié
 * @returns Données de l'utilisateur connecté ou null
 */
export const me = async (
  parent: any,
  args: any,
  context: AuthContext
): Promise<{ id: number; email: string; createdAt: Date; updatedAt: Date } | null> => {
  console.log('🔍 Resolver me - context.user:', context?.user);
  
  // Si pas d'utilisateur dans le contexte, retourner null
  if (!context || !context.user) {
    console.log('🔍 Resolver me - Pas d\'utilisateur dans le contexte');
    return null;
  }

  try {
    // Récupérer les données complètes de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: context.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return user;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw new Error('Erreur lors de la récupération des données utilisateur');
  }
};

export const users = async (_: any, args: { page?: number; pageSize?: number; search?: string }, context: AuthContext) => {
  if (!context?.user || context.user.role !== 'SUPER_ADMIN') throw new Error('Accès refusé');
  const page = Math.max(1, args.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, args.pageSize ?? 20));
  const where = args.search
    ? { OR: [{ email: { contains: args.search, mode: 'insensitive' as const } }] }
    : {};
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true }
    }),
    prisma.user.count({ where })
  ]);
  return { items, total, page, pageSize };
};

export const user = async (_: any, { id }: { id: string }, context: AuthContext) => {
  if (!context?.user || context.user.role !== 'SUPER_ADMIN') throw new Error('Accès refusé');
  return prisma.user.findUnique({ where: { id: parseInt(id) } });
};

export const metrics = async (_: any, __: any, context: AuthContext) => {
  console.log('🔍 Metrics resolver - Context:', context);
  console.log('🔍 Metrics resolver - User:', context?.user);
  console.log('🔍 Metrics resolver - Role:', context?.user?.role);
  
  if (!context?.user) {
    console.log('❌ Metrics resolver - Pas d\'utilisateur authentifié');
    throw new Error('Accès refusé - Authentification requise');
  }
  
  if (context.user.role !== 'SUPER_ADMIN') {
    console.log('❌ Metrics resolver - Rôle insuffisant:', context.user.role);
    throw new Error('Accès refusé - Privilèges SUPER_ADMIN requis');
  }
  
  console.log('✅ Metrics resolver - Accès autorisé, calcul des métriques...');
  
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  
  const [totalUsers, totalProducts, productsLast7d, adminsCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.product.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { role: 'ADMIN' } })
  ]);
  
  const result = { totalUsers, totalProducts, productsLast7d, adminsCount };
  console.log('✅ Metrics resolver - Résultat:', result);
  
  return result;
};
