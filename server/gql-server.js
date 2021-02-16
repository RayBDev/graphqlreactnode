require('dotenv').config();
const { ApolloServer } = require('apollo-server');

// types query / mutation / subscription
const typeDefs = `
type Query {
  totalPosts: Int!
}
`;

// resolvers
const resolvers = {
  Query: {
    totalPosts: () => 42,
  },
};

// graphql server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// PORT setup
apolloServer.listen(process.env.PORT, function () {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
