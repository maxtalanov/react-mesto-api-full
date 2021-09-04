const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'some-secret-key' } = process.env;
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
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new ForbiddenErrors('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса;
  next(); // пропускаем запрос дальше
};
