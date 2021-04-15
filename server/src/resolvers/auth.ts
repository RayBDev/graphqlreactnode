const { authCheck } = require('../helpers/auth');

const me = async (_: void, args: any, context: any) => {
  await authCheck(context.req);
  return 'Ray';
};

module.exports = {
  Query: {
    me,
  },
};
