import { IResolvers } from 'graphql-tools';
import { posts } from '../temp';
import { authCheck } from '../helpers/auth';

// queries
const totalPosts = () => posts.length;
const allPosts = async (_: void, args: any, { req }: { req: any }) => {
  // await authCheck(req);
  return posts;
};

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
