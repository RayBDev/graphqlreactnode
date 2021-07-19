import { IResolvers } from 'graphql-tools';
import e from 'express';

import { User } from '../models/user';
import { Post } from '../models/post';
import { authCheck } from '../helpers/auth';

// queries
const allPosts = async () => {
  return await Post.find({})
    .populate('postedBy', '_id username')
    .sort({ createdAt: -1 })
    .exec();
};

const postsByUser = async (_: void, args: any, { req }: { req: e.Request }) => {
  // Check auth header and get the current firebase user
  const currentUser = await authCheck(req);

  // Find the user in the MongoDB database using the details gathered from Firebase
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();

  // Find all posts by the current authorized user and ensure to populate the postedBy return with the _id and username. Finally sort the returned posts from earliest to latest.
  return await Post.find({ postedBy: currentUserFromDb })
    .populate('postedBy', '_id username')
    .sort({ createdAt: -1 });
};

// mutations
const postCreate = async (_: void, args: any, { req }: { req: e.Request }) => {
  // Check auth header and get the current firebase user
  const currentUser = await authCheck(req);

  // Ensure that the mutation at least has content
  if (args.input.content.trim() === '') throw new Error('Content is required');

  // Find the user in the MongoDB database using the details gathered from Firebase
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();

  // Create a new post using the arguments.input and spread them out. Add postedBy entry to keep a record of the id of the user making the post
  const newPost = await new Post({
    ...args.input,
    postedBy: currentUserFromDb?._id,
  }).save();

  // Create a linkage between the Post and User collection with the user's id and username
  await newPost.populate('postedBy', '_id username').execPopulate();

  // Return the newPost document
  return newPost;
};

// Build out the resolver map and set it's type
const resolverMap: IResolvers = {
  Query: {
    allPosts,
    postsByUser,
  },
  Mutation: {
    postCreate,
  },
};

module.exports = resolverMap;
