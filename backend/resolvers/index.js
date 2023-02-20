const Query = require("./query");
const Mutation = require("./mutation");
const Type = require("./Type");

const resolvers = {
  Query,
  Mutation,
  ...Type,
};

module.exports = resolvers;
