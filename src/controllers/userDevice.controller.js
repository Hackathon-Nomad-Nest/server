const httpStatus = require('http-status');
const { userDeviceService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createUserDevice = catchAsync(async (req, res) => {
  const doc = await userDeviceService.createUserDevice(req);
  res.status(httpStatus.OK).send(doc);
});

const deleteUserDevice = catchAsync(async (req, res) => {
  await userDeviceService.deleteUserDevice(req);
  res.status(httpStatus.OK).send({ status: 'success' });
});

module.exports = { createUserDevice, deleteUserDevice };
