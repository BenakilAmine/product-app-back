import { sign, verify } from 'jsonwebtoken'; 
import { hash, compare } from 'bcryptjs';
// const { sign, verify } = jwt;
// Interface pour le payload JWT
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

// Interface pour le contexte d'authentification
export interface AuthContext {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

/**
 * Génère un token JWT pour un utilisateur
 * @param payload - Données utilisateur à encoder
 * @returns Token JWT signé
 */
export function generateToken(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET non configuré');
  }
  
  return sign(payload, secret, { expiresIn: '7d' });
}

/**
 * Vérifie et décode un token JWT
 * @param token - Token JWT à vérifier
 * @returns Payload décodé ou null si invalide
 */
export function verifyToken(token: string): JWTPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET non configuré');
  }

  try {
    return verify(token, secret) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Hash un mot de passe avec bcrypt
 * @param password - Mot de passe en clair
 * @returns Mot de passe hashé
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return hash(password, saltRounds);
}

/**
 * Vérifie un mot de passe contre son hash
 * @param password - Mot de passe en clair
 * @param hashedPassword - Mot de passe hashé
 * @returns true si le mot de passe correspond
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

/**
 * Extrait le token JWT depuis le header Authorization
 * @param authHeader - Header Authorization (format: "Bearer <token>")
 * @returns Token JWT ou null
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Retire "Bearer "
}