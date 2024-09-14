const ignoredRoutes = {
  CHANGE_PASSWORD: '/v1/auth/change-password',
  RESET_PASSWORD: '/v1/auth/reset-password',
  NOTIFY_GROUP_SOCKET: '/notifyGroup',
};

const ignoredRoutesArray = Object.values(ignoredRoutes);

module.exports = {
  ignoredRoutes,
  ignoredRoutesArray,
};
