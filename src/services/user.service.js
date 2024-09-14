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
    await dbService.createOne({
      model: User,
      reqParams: {
        ...userBody,
      },
    });
  }
};

module.exports = {
  storeNewUser,
};
