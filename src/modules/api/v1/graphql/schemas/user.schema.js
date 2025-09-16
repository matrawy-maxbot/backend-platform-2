// src/modules/api/v1/graphql/schemas/user.schema.js
import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getUser(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User
  }
`;

export default typeDefs;