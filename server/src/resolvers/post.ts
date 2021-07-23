import { IResolvers } from 'graphql-tools';
import e from 'express';

import { User } from '../models/user';
import { Post } from '../models/post';
import { authCheck } from '../helpers/auth';

// QUERIES
const totalPosts = async (_: void, args: any) => {
  return await Post.find({}).estimatedDocumentCount().exec();
};

const allPosts = async (_: void, args: any) => {
  // The page in the pagination tree to display
  const currentPage = args.page || 1;
  // The number of posts to display per page
  const perPage = 3;

  // Skip posts not meant to be on the requested page and also limit the posts for that page to our predefined number i.e. 3.
  return await Post.find({})
    .skip((currentPage - 1) * perPage)
    .populate('postedBy', '_id username')
    .limit(perPage)
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
  return await Post.find({ postedBy: { _id: currentUserFromDb!._id } })
    .populate('postedBy', '_id username')
    .sort({ createdAt: -1 });
};

const singlePost = async (_: void, args: any) => {
  // Return a single post found by id and populate the postedBy field with the id and username
  return await Post.findById({ _id: args.postId })
    .populate('postedBy', '_id username')
    .exec();
};

// MUTATIONS
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

const postUpdate = async (_: void, args: any, { req }: { req: e.Request }) => {
  // Check auth header and get the current firebase user
  const currentUser = await authCheck(req);

  // Ensure that the mutation at least has content
  if (args.input.content.trim() === '') throw new Error('Content is required');

  // Find the user in the MongoDB database using the details gathered from Firebase
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();

  // Find the post in MongoDB based on the ID provided from the client side
  const postToUpdate = await Post.findById({
    _id: args.input._id,
  }).exec();

  // If currentUser id and id of the post's postedBy user id is not the same then throw an error
  if (currentUserFromDb?._id.toString() !== postToUpdate?.postedBy.toString())
    throw new Error('Unauthorized user access');

  // Find the post by its ID, update the post with the args provided from the client side, and return the new post details, not the old post details
  let updatedPost = await Post.findByIdAndUpdate(
    args.input._id,
    { ...args.input },
    { new: true }
  ).exec();

  // Create a linkage between the Post and User collection with the user's id and username
  await updatedPost?.populate('postedBy', '_id username').execPopulate();

  return updatedPost;
};

const postDelete = async (_: void, args: any, { req }: { req: e.Request }) => {
  // Check auth header and get the current firebase user
  const currentUser = await authCheck(req);

  // Find the user in the MongoDB database using the details gathered from Firebase
  const currentUserFromDb = await User.findOne({
    email: currentUser.email,
  }).exec();

  // Find the post in MongoDB based on the ID provided from the client side
  const postToDelete = await Post.findById({
    _id: args.postId,
  }).exec();

  // If currentUser id and id of the post's postedBy user id is not the same then throw an error
  if (currentUserFromDb?._id.toString() !== postToDelete?.postedBy.toString())
    throw new Error('Unauthorized user access');

  // Find the post by its ID, update the post with the args provided from the client side, and return the new post details, not the old post details
  let deletedPost = await Post.findByIdAndDelete({ _id: args.postId }).exec();

  return deletedPost;
};

// Build out the resolver map and set it's type
const resolverMap: IResolvers = {
  Query: {
    allPosts,
    postsByUser,
    singlePost,
    totalPosts,
  },
  Mutation: {
    postCreate,
    postUpdate,
    postDelete,
  },
};

module.exports = resolverMap;
