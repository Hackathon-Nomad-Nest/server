const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { ticketService } = require('../services');

const createTicket = catchAsync(async (req, res) => {
  await ticketService.createTicketAndSendMailToUserAndDevs(req.body);
  res.status(httpStatus.OK).send({message: 'Ok'});
});

module.exports = {
    createTicket
};