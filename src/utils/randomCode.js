const crypto = require('crypto');

const generateReferralCode = (length = 8) => {
    // Generate a random string of specified length using the crypto module
    return crypto.randomBytes(length).toString('hex').slice(0, length).toLowerCase();
};

module.exports = generateReferralCode;