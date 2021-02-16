if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
//const http = require('http');
const path = require('path');
const mongoose = require('mongoose');

// const { makeExecutableSchema } = require('graphql-tools');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');

// Create Express Server
const app = express();

// DB Connection Setup
const db = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
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
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, './resolvers'))
);

// graphql server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// applyMiddleware method connect ApolloServer to a HTTP framework like express at /graphql endpoint

apolloServer.applyMiddleware({ app });

// server
//const httpServer = http.createServer(app);

// REST Endpoint
app.get('/rest', function (req, res) {
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
