import { PrismaClient } from '@prisma/client';
import { AuthContext } from '../utils/auth';

// Interface pour le contexte GraphQL
export interface Context extends AuthContext {
  prisma: PrismaClient;
}

// Types pour les arguments des résolveurs
export interface CreateProductArgs {
  input: {
    name: string;
    price: number;
  };
}

// Type générique pour les résolveurs GraphQL
export type Resolver<Args = unknown, Return = unknown> = (
  parent: unknown,
  args: Args,
  context: Context
) => Promise<Return> | Return;

// Types pour les réponses des résolveurs (types réels retournés)
export type Product = {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
};

export type ProductsResolver = Resolver<unknown, Product[]>;
export type CreateProductResolver = Resolver<CreateProductArgs, Product>;