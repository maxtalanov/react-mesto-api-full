const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

// eslint-disable-next-line no-undef
router.get('*', noRouter = (req, res, next) => {
  next(new NotFoundError('Данный маршрут не существует'));
});

module.exports = router;
