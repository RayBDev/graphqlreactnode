import e from 'express';
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const authCheck = async (req: e.Request) => {
  try {
    if (typeof req.headers.authtoken === 'string') {
      // Verify the auth token exists in the headers and if successful do something with the returned user (AKA decodedIdToken)
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

export const authCheckMiddleware = async (
  req: e.Request,
  res: e.Response,
  next: e.NextFunction
) => {
  try {
    if (typeof req.headers.authtoken === 'string') {
      // Verify the auth token exists in the headers and if successful, allow endpoint to continue using next()
      await admin.auth().verifyIdToken(req.headers.authtoken);
      next();
    } else {
      res.json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    // If auth token in header is not valid, return a jason error response
    res.json({ error: 'Invalid or expired token' });
  }
};
