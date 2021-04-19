import { authCheck } from '../helpers/auth';
import { User } from '../models/user';
import { nanoid } from 'nanoid';
import e from 'express';

const me = async (_: void, args: any, context: any) => {
  await authCheck(context.req);
  return 'Ray';
};

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

module.exports = {
  Query: {
    me,
  },
  Mutation: {
    userCreate,
  },
};
