const ticketOpenedMailForUser = {
    text: `Hello,

Thank you for reaching out to us. We have successfully registered your query, and a support ticket has been opened. 

Our support team will review your request and get back to you soon.

Thank you for your patience.

Best regards,
Your Support Team`,
    subject: 'Your Query Has Been Registered',
};

const ticketOpenedMailForDevs = {
    text: `Hello,

A new support ticket has been opened. Please check the ticket for further details.

Thank you,
Support Team`,
    subject: 'New Support Ticket Opened',
};

module.exports = {
    ticketOpenedMailForUser,
    ticketOpenedMailForDevs,
}