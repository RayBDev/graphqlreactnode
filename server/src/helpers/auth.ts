import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

exports.authCheck = async (req: any) => {
  try {
    // Verify the auth token in the header and if successful do something with the returned user (AKA decodedIdToken)
    const currentUser = await admin.auth().verifyIdToken(req.headers.authtoken);
    console.log('Current User', currentUser);
    return currentUser;
  } catch (error) {
    // If auth token in header is not valid, throw new error
    console.log('AUTH CHECK ERROR', error);
    throw new Error('Invalid or expired token');
  }
};
