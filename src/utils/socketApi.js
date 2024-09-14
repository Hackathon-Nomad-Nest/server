const axios = require('axios');
const { socketURL } = require('../config/config');

const addSubscription = async (params) => {
  try {
    await axios({
      method: 'post',
      url: `${socketURL}/addSubscription`,
      data: {
        ...params,
      },
    });
  } catch (error) {
    return { error };
  }
};

const notifyGroup = async (params) => {
  try {
    await axios({
      method: 'post',
      url: `${socketURL}/notifyGroup`,
      data: params,
    });
  } catch (error) {
    console.log('error in notifyGroup', error);
    return { error };
  }
};

module.exports = {
  addSubscription,
  notifyGroup,
};
