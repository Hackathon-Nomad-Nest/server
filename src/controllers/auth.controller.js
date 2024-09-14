const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const loginUser = catchAsync(async (req, res) => {
  await userService.storeNewUser(req.body);
  res.status(httpStatus.OK).send({message: 'Ok'});
});

module.exports = {
  loginUser
};