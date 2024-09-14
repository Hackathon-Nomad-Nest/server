const config = require('../config/config');
const sendMailFromSendGrid = require('../utils/sendMail');
const { ticketOpenedMailForUser, ticketOpenedMailForDevs } = require('../config/email');


const sendCreationMailToUserAndDevs = async (userEmail) => {
  try {
      await sendMailFromSendGrid({
        to: userEmail, 
        ...ticketOpenedMailForUser,
      });
      await sendMailFromSendGrid({
        to: config.email.applicationDeveloper, 
        ...ticketOpenedMailForDevs,
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
    sendCreationMailToUserAndDevs,
}