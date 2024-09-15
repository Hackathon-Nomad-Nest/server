const  dbService  = require('./db.service');
const { User } = require('../models');

const storeNewUser = async (userBody) => {
  const user = await dbService.getOne({
    model: User,
    filter: {
      email: userBody.email,
    },
  });
  if (!user) {
    return await dbService.createOne({
      model: User,
      reqParams: {
        ...userBody,
      },
    });
  }
  return user;
};

module.exports = {
  storeNewUser,
};
