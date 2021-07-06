import { authCheck } from '../helpers/auth';
import { User } from '../models/user';
import { nanoid } from 'nanoid';
import e from 'express';
import {
  DateTimeResolver,
  URLResolver,
  EmailAddressResolver,
} from 'graphql-scalars';

const profile = async (_: void, args: any, { req }: { req: e.Request }) => {
  // Get the DecodedIDToken (aka currentUser object) by running authCheck and passing in req so authCheck has access to the headers
  const currentUser = await authCheck(req);

  // Find and return the user document in MongoDB using the current logged in user's email
  return await User.findOne({ email: currentUser.email }).exec();
};

const publicProfile = async (_: void, args: any) => {
  // Public profile doesn't require any auth headers so simply find the user by username
  return await User.findOne({ username: args.username }).exec();
};

// Output all users
const allUsers = async () => await User.find({}).exec();

const userCreate = async (_: any, args: any, { req }: { req: e.Request }) => {
  // Get the DecodedIDToken (aka currentUser object) by running authCheck and passing in req so authCheck has access to the headers
  const currentUser = await authCheck(req);

  // Find the user document in MongoDB using the current logged in user's email
  const user = await User.findOne({ email: currentUser.email });

  // If user is found return the User model/document and if not save a new User Model. Username is random and can be changed later
  return user
    ? user
    : await new User({
        email: currentUser.email,
        username: nanoid(12),
      }).save();
};

const userUpdate = async (_: any, args: any, { req }: { req: e.Request }) => {
  // Get the DecodedIDToken (aka currentUser object) by running authCheck and passing in req so authCheck has access to the headers
  const currentUser = await authCheck(req);

  // Run the Mongoose findOneAndUpdate method by finding the document with the user's email, then providing all the args received from the mutation. Return new will return the updated user document instead of the old document. Finally, execute the findOneAndUpdate query.
  const updatedUser = await User.findOneAndUpdate(
    { email: currentUser.email },
    { ...args.input },
    { new: true }
  ).exec();
  return updatedUser;
};

module.exports = {
  DateTime: DateTimeResolver,
  URL: URLResolver,
  EmailAddress: EmailAddressResolver,
  Query: {
    profile,
    publicProfile,
    allUsers,
  },
  Mutation: {
    userCreate,
    userUpdate,
  },
};
