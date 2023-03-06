const Query = require('./query');
const Mutation = require('./mutation');
const Type = require('./Type');

const resolvers = {
  Query: {
    me: (parent, args, {currentUser}) => currentUser,
  },
  Mutation,
  ...Type,
};

module.exports = resolvers;
