const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestErrors = require('../errors/bad-request-err');
const ForbiddenErrors = require('../errors/forbidden-err');

// 1. Запрос добавление карточки пользовотеля
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErrors('Переданы некорректные данные карточки'));
      }
    });
};

// 2. Запрос на получение всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Запрошенные карточки не найдены'));
      }
    });
};

// 3. Запрос удаления карточки
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findById(cardId)
    .orFail(new Error('NotValidID'))
    .then((card) => {
      if (_id === card.owner._id.toString()) {
        return Card.findByIdAndRemove(card)
          .then((card) => {
            res.status(200).send({ card });
          })
          .catch(next)
      }
      next(new ForbiddenErrors('Данная карточка принадлежит не вам'));
    })
    .catch((err) => {
      if (err.message === 'NotValidID') {
        next(new NotFoundError('Карточка с таким ID не нвйдена в базе'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestErrors('Передан некорректный ID карточки'));
      }
      next(err);
    });
};

// 3. Запрос на добавление лайка карточке
module.exports.addLikesCard = (req, res, next) => {
  const {
    _id,
  } = req.user;

  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .populate(['likes'])
    .orFail(new Error('NotValidID'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValidID') {
        next(new NotFoundError('Карточка с таким ID не найдена в базе'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestErrors('Передан неправильный ID карточки'));
      }
    });
};

// 3. Запрос на удаление лайка карточке
module.exports.deleteLikesCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .orFail(new Error('NotValidID'))
    .then((cardNew) => res.status(200).send({ cardNew }))
    .catch((err) => {
      if (err.message === 'NotValidID') {
        next(new NotFoundError('Карточка с таким ID не найдена в базе'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestErrors('Передан некорректный ID карточки'));
      }
    });
};
