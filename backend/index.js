// 1. 'apollo-server'를 불러옵니다
const expressPlayground = require('graphql-playground-middleware-express').default;
const {ApolloServer} = require('apollo-server-express');
const express = require('express');
const {readFileSync} = require('fs');

var typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8');
const resolvers = require('./resolvers');

const {MongoClient} = require('mongodb');
require('dotenv').config();

async function start() {
  const app = express();
  const MONGO_DB = process.env.DB_HOST;

  const client = await MongoClient.connect(MONGO_DB);

  const db = client.db();

  const context = async ({req}) => {
    const githubToken = req.headers.authorization;
    const currentUser = await db.collection('users').findOne({githubToken});
    return {db, currentUser};
  };

  const server = new ApolloServer({typeDefs, resolvers, context});

  await server.start();

  server.applyMiddleware({app});

  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'));

  app.get('/playground', expressPlayground({endpoint: '/graphql'}));

  app.listen({port: 4000}, () => console.log(`GraphQL Server running at http://localhost:4000${server.graphqlPath}`));
}

start();
