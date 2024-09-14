
const socketServer = require('socket.io');
const config = require('./config/config');

const subscription = {};

const getRequestParams = function (req) {
  const requestParams = {};
  Object.keys(req.query).forEach((val) => {
    requestParams[val] = req.query[val];
  });
  Object.keys(req.params).forEach((val) => {
    requestParams[val] = req.query[val];
  });
  return requestParams;
};


const configure = async function (server, app) {
  const io = socketServer(server, { cors: { origin: config.whitelistedURL, credentials: true } });

  io.on('connection', async (socket) => {
    socket.on('join', async ({ uid, }) => {
        socket.join(uid, () => {
          socket.emit('joined', uid);
        });
        
    });

    socket.on('leave', async ({ uid,}) => {
      
      socket.leave(uid, () => {
        // socket.emit('joined', groupId);
      });
    });
  });


  app.post('/notifyGroup', async (req, res) => {
    try {
      const { body } = req || {};
      for (const item of body) {
        const { operation: dbOperation, groupIdArray = [] } = item || {};
        groupIdArray.forEach((val) => {
          const { groupName, data } = val || {};
          if (data._id) {
            data.id = data._id;
          }
          io.to(groupName).emit('data', { data, operation: dbOperation, uid: groupName });
        });
      }

      res.send({ status: 200, message: 'Update Successfully' });
    } catch (error) {
      res.send({ status: 400, message: error.message });
    }
  });

  app.post('/addSubscription', (req, res) => {
    try {
      const { body } = req;
      const { filter, model, uid, populate } = body || {};
      if (!subscription[model]) {
        subscription[model] = {};
      }
      subscription[model][uid] = { filter, populate };
      res.send({ status: 200, message: 'Subscription added successfully' });
    } catch (error) {
      res.send({ status: 400, message: error.message });
    }
  });

  app.post('/removeSubscription', (req, res) => {
    try {
      const { uid, model } = getRequestParams(req);
      if (subscription[model]) {
        delete subscription[model][uid];
      }
      res.send({ status: 200, message: 'Subscription removed successfully' });
    } catch (error) {
      res.send({ status: 400, message: error.message });
    }
  });
};

module.exports = {
  configure,
};
