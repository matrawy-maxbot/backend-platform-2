// src/modules/api/v1/graphql/resolvers/user.resolver.js
import { getUserById, createUser as _createUser } from '../../restful/services/user.service';

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      return await getUserById(id);
    },
  },
  Mutation: {
    createUser: async (_, { name, email, password }) => {
      return await _createUser({ name, email, password });
    },
  },
};

export default resolvers;