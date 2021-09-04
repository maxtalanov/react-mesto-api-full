const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { regUrl } = require('../utils/const');

const {
  getUser, getUsers, createUser, upDateUser, upDataUserAvatar, login, getUserMe, exit,
} = require('../controllers/users');

// 1. Получить мои данные
router.get('/users/me', auth, getUserMe);

// 2. Возвращает всех пользователей
router.get('/users', auth, getUsers);

// 3. Возвращает пользователя по _id
router.get('/users/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

// 4. Создаёт пользователя
router.post('/users', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// 5. Обновляет профиль
router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), upDateUser);

// 6. Обновляет аватар
router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regUrl),
  }),
}), upDataUserAvatar);

// 7. Залогинить пользовотеля
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

// 8. Зарегистрировать пользователя
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// 9. Выход пользователя
router.get('/exit', exit);

module.exports = router;
