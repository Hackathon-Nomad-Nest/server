const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const loginUser = catchAsync(async (req, res) => {
  const {given_name , family_name , ...rest} = req.body;
  const body = {
    givenName : given_name,
    familyName: family_name,
    ...rest,
  }
  await userService.storeNewUser(body);
  res.status(httpStatus.OK).send({message: 'Ok'});
});

module.exports = {
  loginUser
};