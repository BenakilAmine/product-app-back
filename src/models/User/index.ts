// Export centralisé du modèle User
export { userTypeDefs } from './schema';
export { userResolvers } from './resolvers';
export type { 
  User, 
  CreateUserArgs, 
  LoginArgs, 
  AuthResponse,
  CreateUserResolver,
  LoginResolver,
  MeResolver 
} from './types';