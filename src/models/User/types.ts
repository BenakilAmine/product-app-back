// Types TypeScript pour le modèle User

export interface User {
  id: number;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserArgs {
  email: string;
  password: string;
}

export interface LoginArgs {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

// Types pour les résolveurs GraphQL
export interface CreateUserResolver {
  (parent: any, args: CreateUserArgs, context: any): Promise<AuthResponse>;
}

export interface LoginResolver {
  (parent: any, args: LoginArgs, context: any): Promise<AuthResponse>;
}

export interface MeResolver {
  (parent: any, args: any, context: any): Promise<{ id: number; email: string; role: string; createdAt: Date; updatedAt: Date } | null>;
}