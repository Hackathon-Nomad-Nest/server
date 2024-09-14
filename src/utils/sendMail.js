const httpStatus = require('http-status');
const sgMail = require('@sendgrid/mail');
const config = require('../config/config');
const ApiError = require('./ApiError');
const { errorMessages } = require('../config/error');
// const { practiceSettingTypes } = require('../config/practiceSettings');
// const  PracticeSettings  = require('../models/practiceSettings.model');
/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const { skippedOptions, email } = config;
const { sendgridKey, from, name } = email;

const sendMailFromSendGrid = async ({ to, subject, text, html, attachments, practice }, isErrorMail = false) => {
  if (!to || !subject || !(text || html)) {
    throw new ApiError(httpStatus.BAD_REQUEST, errorMessages.INCOMPLETE_PARAMS);
  }

  if (skippedOptions && skippedOptions.skipEmails) {
    console.log('METHOD CALLED AND SKIPPED FOR SEND MAIL WITH SUBJECT:', subject);
    return { responseMessage: 'SEND MAIL IS SKIPPED.' };
  }

  let msg = {};
  if (!isErrorMail) {
    if (!sendgridKey || !from) throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, errorMessages.MAIL_NOT_SETUP);

    sgMail.setApiKey(sendgridKey);

    msg = {
      to,
      from: {
        email: from,
        name,
      },
      subject,
      text,
      html,
    };
  } else {
    // default sendGrid creds used
    sgMail.setApiKey(sendgridKey);
    msg = {
      to,
      from: {
        email: from,
        name,
      }, // Use the email address or domain you verified above
      subject,
      text,
      html,
    };
  }
  if (attachments?.length) {
    msg.attachments = attachments;
  }

  // eslint-disable-next-line import/no-extraneous-dependencies
  try {
    const response = await sgMail.send(msg);
    let { statusCode } = response && response.length && response[0];
    statusCode = String(statusCode);
    if (!statusCode.startsWith('20')) {
      throw new ApiError(httpStatus.BAD_GATEWAY, 'Error sending email');
    }
  } catch (error) {
    console.log(error);
  }
};

const sendErrorMail = async ({ subject, ...rest }) => {
  // eslint-disable-next-line no-param-reassign
  subject = `${subject} (${config.env} ${config?.mailEnv || ''})`;
  await sendMailFromSendGrid({ subject, ...rest }, true);
};

module.exports = {
  sendMailFromSendGrid,
  sendErrorMail,
};
