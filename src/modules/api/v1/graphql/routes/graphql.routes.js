// src/modules/api/v1/graphql/routes/graphql.routes.js
import { ApolloServer } from 'apollo-server-express';
import typeDefs from '../schemas/user.schema';
import resolvers from '../resolvers/user.resolver';

const server = new ApolloServer({ typeDefs, resolvers });

export default server;