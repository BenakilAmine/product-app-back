import { PrismaClient } from '@prisma/client';
import { hashPassword, generateToken } from '../../../utils/auth';
import { CreateUserArgs, LoginArgs, AuthResponse } from '../types';

const prisma = new PrismaClient();

/**
 * Mutation pour créer un nouveau compte utilisateur (signup)
 * @param parent - Parent resolver
 * @param args - Arguments contenant email et password
 * @param context - Contexte GraphQL
 * @returns Token JWT et données utilisateur
 */
export const signup = async (
  parent: any,
  args: { input: CreateUserArgs },
  context: any
): Promise<AuthResponse> => {
  console.log('🚀 SIGNUP MUTATION DÉMARRÉE');
  console.log('📥 Args reçus:', JSON.stringify(args, null, 2));
  
  const { email, password } = args.input;
  console.log('🔍 Mutation signup appelée avec email:', email);

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  console.log('👤 Utilisateur existant trouvé:', !!existingUser);
  
  if (existingUser) {
    console.log('❌ Utilisateur existe déjà, lancement d\'erreur');
    throw new Error('Un utilisateur avec cet email existe déjà');
  }

  // Valider le mot de passe (minimum 6 caractères)
  if (password.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
  }

  // Valider l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Format d\'email invalide');
  }

  try {
    console.log('🔐 Hachage du mot de passe...');
    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);
    console.log('✅ Mot de passe haché');

    console.log('👤 Création de l\'utilisateur...');
    console.log('📧 Email:', email);
    console.log('🔑 Mot de passe haché:', hashedPassword.substring(0, 20) + '...');
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER'
      }
    });

    console.log('✅ Utilisateur créé avec ID:', user.id);
    
    // Générer le token JWT
    console.log('🎫 Génération du token JWT...');
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    console.log('🎫 Token JWT généré:', token.substring(0, 20) + '...');

    const result = {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role as string
      }
    };
    
    console.log('🎉 Résultat final:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('❌ Erreur détaillée lors de la création de l\'utilisateur:', error);
    if (error instanceof Error) {
      console.error('❌ Stack trace:', error.stack);
    }
    throw new Error('Erreur lors de la création du compte');
  }
};

/**
 * Mutation pour connecter un utilisateur existant (login)
 * @param parent - Parent resolver
 * @param args - Arguments contenant email et password
 * @param context - Contexte GraphQL
 * @returns Token JWT et données utilisateur
 */
export const login = async (
  parent: any,
  args: { input: LoginArgs },
  context: any
): Promise<AuthResponse> => {
  const { email, password } = args.input;

  try {
    // Trouver l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const { verifyPassword } = await import('../../../utils/auth');
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Générer le token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as string
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role as string
      }
    };
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw new Error('Erreur lors de la connexion');
  }
};
export const setUserRole = async (_: any, { userId, role }: { userId: string; role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' }, context: any) => {
  if (!context?.user || context.user.role !== 'SUPER_ADMIN') throw new Error('Accès refusé');
  return prisma.user.update({
    where: { id: parseInt(userId) },
    data: { role }
  });
};

export const deleteUser = async (_: any, { id }: { id: string }, context: any) => {
  if (!context?.user || context.user.role !== 'SUPER_ADMIN') throw new Error('Accès refusé');
  await prisma.user.delete({ where: { id: parseInt(id) } });
  return true;
};