import 'dotenv/config';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
//const http = require('http');
//const path = require('path');
import depthLimit from 'graphql-depth-limit';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

// const { makeExecutableSchema } = require('graphql-tools');
// const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
// const { loadFilesSync } = require('@graphql-tools/load-files');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { authCheck } = require('./helpers/auth');

// Create Express Server
const app = express();

// DB Connection Setup
const db = async () => {
  try {
    await mongoose.connect(process.env.DATABASE!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('DB Connected');
  } catch (error) {
    console.log('DB Connection Error', error);
  }
};

// Execute database Connection
db();

// Merge Resolvers and typeDefs
/* const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './types')));
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, './resolvers'))
); */

// Add cors and gzip compression for compression as noted here https://expressjs.com/en/advanced/best-practice-performance.html
app.use('*', cors());
app.use(compression());

// graphql server with validation rules
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
  validationRules: [depthLimit(7)],
});

// applyMiddleware method connect ApolloServer to a HTTP framework like express at /graphql endpoint

apolloServer.applyMiddleware({ app });

// server
//const httpServer = http.createServer(app);

// REST Endpoint
app.get('/rest', authCheck, function (req, res) {
  res.json({
    data: 'you hit the rest endpoint',
  });
});

// PORT Setup
app.listen(process.env.PORT, function () {
  console.log(`REST Server running on http://localhost:${process.env.PORT}`);
  console.log(
    `GQL Server running on http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
  );
});
