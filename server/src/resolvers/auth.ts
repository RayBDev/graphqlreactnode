const { authCheck } = require('../helpers/auth');

const me = (_: void, args: any, context: any) => {
  authCheck(context.req, context.res);
  return 'Ray';
};

module.exports = {
  Query: {
    me,
  },
};
