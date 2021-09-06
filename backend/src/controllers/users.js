const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestErrors = require('../errors/bad-request-err');
const Conflict = require('../errors/conflict-err');
const UnauthorizedErrors = require('../errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET, JWT_DEV = 'some-secret-key' } = process.env;
const secretKey = NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV;

const opts = { runValidators: true, new: true };

// 1. Запрос всех пользователей;
module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Запрошенные пользователи не найдены'));
      }
    });
};

// 2. Запрос конкретного пользователя;
module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById({ _id: userId })
    .orFail(new Error('NotValidID'))
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.message === 'NotValidID') {
        next(new NotFoundError('Пользователь с данным ID не найден в базе'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestErrors('Передан некорректныЙ ID пользователя'));
      }
    });
};

// 3. Запрос на добавление пользователя;
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new Conflict('Произошла ошибка'));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    })
      .then(() => {
        res
          .status(201)
          .send({
            email, name, about, avatar,
          });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new NotFoundError('Переданы некорректные данные пользователя'));
        }
        if (err.name === 'MongoError' && err.code === 11000) {
          next(new Conflict('Что-то пошло не так'));
        }
      }));
};

// 4. Запрос на обновление данных пользователя;
module.exports.upDateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, opts)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErrors('Переданы некорректные данные пользователя'));
      }
    });
};

// 5. Запрос на обновление аватара пользователя;
module.exports.upDataUserAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, opts)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErrors('Переданы некорректные данные пользователя'));
      }
    });
};

// 6. Запрос авторизации пользователя;
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedErrors('Запрошенный пользователь не найден'));
      }
      return bcrypt.compare(password, user.password)
        .then((isMatched) => {
          if (!isMatched) {
            next(new UnauthorizedErrors('Неверный email или пароль'));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        secretKey,
        { expiresIn: '7d' },
      );
      return res
        .status(201)
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          // sameSite: 'None',
          // secure: true,
        })
        .send({ message: 'Авторизация успешно пройдена' });
    })
    .catch(() => {
      next(new Conflict('Неверный email или пароль'));
    });
};

// 7. Запрос на получение данных авторизованного пользователя;
module.exports.getUserMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((dataUser) => {
      res.status(200).send(dataUser);
    })
    .catch(() => {
      next(new UnauthorizedErrors('Неправильный ID пользователя'));
    });
};

// 8. Запрос на выход пользователя из системы
module.exports.exit = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Успешный выход' });
};
