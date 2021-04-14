exports.authCheck = (req: any, res: any, next = () => null) => {
  // Look at the HTTP Headers for an auth token and if none is found then throw an error
  if (!req.headers.authtoken) throw new Error('Unauthorized');
  // This is where we'll reach out to firebase to validate the token. For now we'll just hard code a valid authtoken
  const valid = req.headers.authtoken === 'secret';

  // If token is valid then run next() otherwise throw an error.
  if (!valid) {
    throw new Error('Unauthorized');
  } else {
    next();
  }
};
