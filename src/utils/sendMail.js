const sgMail = require('@sendgrid/mail');
const httpStatus = require('http-status');

const config = require('../config/config');
const { errorMessages } = require('../config/error');
sgMail.setApiKey(config.email.sendgridKey);

// Modify sendMail function to accept parameters
const sendMail = async ({ to, from = config.email.from, name = config.email.name, subject, text, html }) => {
  const msg = {
    to,
    from: {
      name,
      email: from,
    },
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, errorMessages.FAILED_TO_SEND_MAIL);
  }
}

module.exports = sendMail;

//Sample function call
// sendMail({
//   to: 'pragatikesarwani38@gmail.com',
//   subject: 'Welcome to Nomad Nest',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// });
