// 403 ошибка: "Доступ к ресурсу запрещен"

class ForbiddenErrors extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenErrors;
