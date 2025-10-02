import { verifyToken, extractTokenFromHeader, AuthContext } from '../utils/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Middleware d'authentification pour Apollo Server
 * Décode le JWT et injecte l'utilisateur dans le contexte
 * @param req - Requête Apollo Server
 * @returns Contexte d'authentification
 */
export async function authMiddleware(req: any): Promise<AuthContext> {
  try {
    // console.log('🔍 AuthMiddleware - req:', req);
    // console.log('🔍 AuthMiddleware - req.headers:', req?.headers);
    
    // Extraire le token du header Authorization
    const authHeader = req?.headers?.authorization;
    console.log('🔍 AuthMiddleware - authHeader:', authHeader);
    
    const token = extractTokenFromHeader(authHeader);
    console.log('🔍 AuthMiddleware - token extrait:', token);

    if (!token) {
      console.log('🔍 AuthMiddleware - Pas de token, retour contexte vide');
      // Pas de token = utilisateur non authentifié (pas d'erreur)
      return {};
    }

    // Vérifier et décoder le token
    const payload = verifyToken(token);
    if (!payload) {
      // Token invalide = utilisateur non authentifié
      return {};
    }

    // Vérifier que l'utilisateur existe toujours en base
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      // Utilisateur supprimé = non authentifié
      return {};
    }

    // Utilisateur authentifié
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as string
      }
    };
  } catch (error) {
    console.error('Erreur dans le middleware d\'authentification:', error);
    // En cas d'erreur, considérer comme non authentifié
    return {};
  }
}