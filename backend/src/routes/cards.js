const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { regUrl } = require('../utils/const');
const {
  createCard, getCards, deleteCard, addLikesCard, deleteLikesCard,
} = require('../controllers/card');

// 1. Возвращает все карточки
router.get('/cards', auth, getCards);

// 2. Создаёт карточку
router.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regUrl),
  }),
}), createCard);

// 3. Удаляет карточку по идентификатору
router.delete('/cards/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

// 4. Поставить лайк карточке
router.put('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), addLikesCard);

// 5. Убрать лайк с карточки
router.delete('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteLikesCard);

module.exports = router;
