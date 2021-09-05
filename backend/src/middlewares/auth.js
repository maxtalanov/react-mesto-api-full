const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET, JWT_DEV = 'some-secret-key' } = process.env;
const secretKey = NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV;

const ForbiddenErrors = require('../errors/forbidden-err');

module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  const cookiesJWT = req.cookies.jwt;

  if (!cookiesJWT) {
    throw new ForbiddenErrors('Необходима авторизация');
  }

  const token = cookiesJWT.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    throw new ForbiddenErrors('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса;
  next(); // пропускаем запрос дальше
};
