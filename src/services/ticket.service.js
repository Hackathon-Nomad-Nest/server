const ticketStatus = require('../config/ticket');
const { Ticket } = require('../models');
const  dbService  = require('./db.service');
const { sendCreationMailToUserAndDevs } = require('./email.service');

const createTicketAndSendMailToUserAndDevs = async (ticketBody) => {
  const res = await dbService.createOne({
    model: Ticket,
    reqParams: {
        openedAt: new Date(),
        status: ticketStatus.OPEN,
        ...ticketBody,
    }
  })

  await sendCreationMailToUserAndDevs(ticketBody.email);
};

module.exports = {
    createTicketAndSendMailToUserAndDevs ,
};