// Export centralisé des résolveurs User
import { me, metrics, user, users } from './queries';
import { signup, login, setUserRole, deleteUser } from './mutations';

// Combinaison des queries et mutations
export const userResolvers = {
  Query: {
    me,
    users,
    user,
    metrics,
  },
  Mutation: {
    signup,
    login,
    setUserRole,
    deleteUser,
  },
};

// Export individuel pour les tests si nécessaire
export { signup, login, setUserRole, deleteUser } from './mutations';
export { me, metrics, user, users } from './queries';