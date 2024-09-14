const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const { sendErrorMail } = require('./utils/sendMail');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('>>Connected to MongoDB');
  server = app.listen(config.port, () => {
    console.log(`>>Listening to port ${config.port}`);
  });
});

const exitHandler = (error, errorType) => {
  const mailParams = {
    subject: `${errorType} q_q team uNdEfInEd`,
    text: `${error.message}`,
    to: config.email.applicationDeveloper,
  };
  sendErrorMail(mailParams);
};

const unexpectedErrorHandler = (errorType) => {
  return (error) => {
    console.log(error);
    exitHandler(error, errorType);
  };
};

process.on('uncaughtException', unexpectedErrorHandler('UncaughtException'));
process.on('unhandledRejection', unexpectedErrorHandler('UnhandledRejection'));

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
