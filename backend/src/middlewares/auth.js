const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'some-secret-key' } = process.env;
const ForbiddenErrors = require('../errors/forbidden-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ForbiddenErrors('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new ForbiddenErrors('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса;
  next(); // пропускаем запрос дальше
};
