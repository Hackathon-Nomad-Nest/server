const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body, req.user);
  res.status(httpStatus.CREATED).send(user);
});

const getSelf = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send(user);
});

const getUser = catchAsync(async (req, res) => {
  console.log('<><><><>');
  res.status(httpStatus.OK).send();
});

const updateUser = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getSelf,
};
