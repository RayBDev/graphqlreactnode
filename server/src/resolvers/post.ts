import { IResolvers } from 'graphql-tools';

const { posts } = require('../temp');

// queries
const totalPosts = () => posts.length;
const allPosts = () => posts;

// mutations
const newPost = (_: void, args: any) => {
  console.log(args);
  // create a new post object
  const post = {
    id: posts.length + 1,
    ...args.input,
  };
  // push new post object to posts array
  posts.push(post);
  return post;
};

// Build out the resolver map and set it's type
const resolverMap: IResolvers = {
  Query: {
    totalPosts,
    allPosts,
  },
  Mutation: {
    newPost,
  },
};

module.exports = resolverMap;
