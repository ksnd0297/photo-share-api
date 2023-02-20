// 1. 'apollo-server'를 불러옵니다
const expressPlayground = require("graphql-playground-middleware-express").default;
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { readFileSync } = require("fs");

var typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
const resolvers = require("./resolvers");

var users = [
  {
    githubLogin: "mHattrup",
    name: "Mike Hattrup",
  },
  {
    githubLogin: "gPlake",
    name: "Glen Plake",
  },
  {
    githubLogin: "sSchmidt",
    name: "Scot Schmidt",
  },
];

var photos = [
  {
    id: "1",
    name: "Dropping the Heart Chute",
    description: "The heart chute is one of my favorite chutes",
    category: "ACTION",
    githubUser: "gPlake",
    created: "3-28-1997",
  },
  {
    id: "2",
    name: "Enjoying the sunshine",
    category: "SELFIE",
    githubUser: "sSchmidt",
    created: "1-2-1985",
  },
  {
    id: "3",
    name: "Gunbarrel 25",
    description: "25 laps on gunbarrel today",
    category: "LANDSCAPE",
    githubUser: "sSchmidt",
    created: "2018-04-15T19:09:57.308Z",
  },
];

var tags = [
  { photoID: "1", userID: "gPlake" },
  { photoID: "2", userID: "sSchmidt" },
  { photoID: "2", userID: "mHattrup" },
  { photoID: "2", userID: "gPlake" },
];

var app = express();

const server = new ApolloServer({ typeDefs, resolvers });

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.get("/", (req, res) => res.send("PhotoShare API에 오신 것을 환영합니다"));

server.start().then((res) => {
  server.applyMiddleware({ app });
  app.listen({ port: 4000 }, () => console.log(`GraphQL Server running @ http://localhost:4000`));
});
