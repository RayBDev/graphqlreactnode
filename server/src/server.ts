import 'dotenv/config';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
//const http = require('http');
//const path = require('path');
import depthLimit from 'graphql-depth-limit';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { nanoid } from 'nanoid';

// const { makeExecutableSchema } = require('graphql-tools');
// const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
// const { loadFilesSync } = require('@graphql-tools/load-files');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { authCheckMiddleware } = require('./helpers/auth');

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

// Add pre-flight cors and gzip compression for compression as noted here https://expressjs.com/en/advanced/best-practice-performance.html
app.use('*', cors());
app.use(compression());
app.use(express.json({ limit: '5mb' }));

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
app.get('/rest', authCheckMiddleware, function (req, res) {
  res.json({
    data: 'you hit the rest endpoint',
  });
});

// Upload Image Endpoint
app.post('/uploadimages', authCheckMiddleware, (req, res) => {
  cloudinary.uploader.upload(
    req.body.image,
    {
      resource_type: 'auto', // JPEG, PNG
      public_id: nanoid(12), // Public Name
    },
    (error, result) => {
      if (result) {
        res.send({
          url: result.url,
          public_id: result.public_id,
        });
      } else {
        res.status(504).send('Image server is down');
      }
    }
  );
});

// Remove Image Endpoint
app.post('/removeimage', authCheckMiddleware, (req, res) => {
  const image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (error: any, result: any) => {
    if (error) return res.json({ success: false, error });
    res.send('ok');
  });
});

// PORT Setup
app.listen(process.env.PORT, function () {
  console.log(`REST Server running on http://localhost:${process.env.PORT}`);
  console.log(
    `GQL Server running on http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
  );
});
