import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  enum Role {
    USER
    ADMIN
    SUPER_ADMIN
  }

  type User {
    id: ID!
    email: String!
    role: Role!
    createdAt: String
    updatedAt: String
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  input CreateUserInput {
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type UsersPage {
    items: [User!]!
    total: Int!
    page: Int!
    pageSize: Int!
  }

  type Metrics {
    totalUsers: Int!
    totalProducts: Int!
    productsLast7d: Int!
    adminsCount: Int!
  }

  extend type Query {
    me: User
    users(page: Int = 1, pageSize: Int = 20, search: String): UsersPage!       # SUPER_ADMIN
    user(id: ID!): User                                                          # SUPER_ADMIN
    metrics: Metrics!                                                            # SUPER_ADMIN
  }

  extend type Mutation {
    signup(input: CreateUserInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!

    setUserRole(userId: ID!, role: Role!): User!                                 # SUPER_ADMIN
    deleteUser(id: ID!): Boolean!                                                # SUPER_ADMIN
  }
`;