const userRoutes = require('./users');
const cardRoutes = require('./cards');
const router404 = require('./not-found');

module.exports = {
  userRoutes,
  cardRoutes,
  router404,
};
