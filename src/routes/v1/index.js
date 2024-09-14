const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const config = require('../../config/config');
const userDeviceRoute = require('./userDevice.route');



const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
 
  {
    path: '/user',
    route: userRoute,
  },
  
  {
    path: '/user-device',
    route: userDeviceRoute,
  },
];



defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
