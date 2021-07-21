// 401 ошибка: "Неавторизованный запрос"

class UnauthorizedErrors extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedErrors;
