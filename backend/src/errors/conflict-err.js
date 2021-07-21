// 409 ошибка: "Запрос конфликтует с другим запросом или с конфигурацией сервера"
class ConflictErrors extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}
module.exports = ConflictErrors;
