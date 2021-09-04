// eslint-disable-next-line no-useless-escape
// const regUrl = /^(http|https):\/\/(www.)?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\.[\w\/]+#?/;
// eslint-disable-next-line no-useless-escape
const regUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;

module.exports = {
  regUrl,
};
