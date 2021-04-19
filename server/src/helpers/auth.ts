import e from 'express';
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const authCheck = async (req: e.Request) => {
  try {
    if (typeof req.headers.authtoken === 'string') {
      // Verify the auth token in the header and if successful do something with the returned user (AKA decodedIdToken)
      const currentUser = await admin
        .auth()
        .verifyIdToken(req.headers.authtoken);
      return currentUser;
    } else {
      throw new Error('Invalid or expired token');
    }
  } catch (error) {
    // If auth token in header is not valid, throw new error
    throw new Error('Invalid or expired token');
  }
};
