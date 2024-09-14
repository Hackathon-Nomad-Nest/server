const express = require('express');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const planRoute = require('./plan.route');
const imagesRoute = require('./images.route');



const router = express.Router();

const defaultRoutes = [
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/itinerary-plan',
    route: planRoute,
  },
  {
    path: '/images',
    route: imagesRoute,
  }
];



defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
