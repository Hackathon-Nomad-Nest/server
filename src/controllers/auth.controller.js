const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService,
} = require('../services');

const register = catchAsync(async (req, res) => {
  
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
 
  res.status(httpStatus.OK).send({ user });
});

const logout = catchAsync(async (req, res) => {
  
  res.status(httpStatus.OK).send({ status: 'success' });
});

const refreshTokens = catchAsync(async (req, res) => {
  
  res.status(httpStatus.OK).send({ status: 'success' });
});

const forgotPassword = catchAsync(async (req, res) => {
  
  res.status(httpStatus.OK).send({ status: 'success' });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.OK).send({ status: 'success' });
});


const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const validateToken = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send(user);
});

const changePassword = catchAsync(async (req, res) => {
    res.status(httpStatus.OK).send({ status: 'success' });
});

const isValidToken = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({ status: 'success', message});
});

const validateTokenForMobileApp = catchAsync(async (req, res) => {
  
  res.status(httpStatus.OK).send({ success: true });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  validateToken,
  changePassword,
  isValidToken,
  validateTokenForMobileApp,
};
