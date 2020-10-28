/* eslint-disable consistent-return */
const Card = require('../models/card.js');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data');
const ForbiddenError = require('../errors/forbidden-error');

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Переданы некорректные данные');
      }
      return next(err);
    })
    .catch(next);
};

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// check owner id and req.user._id
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      const isCardOwner = card.owner.toString() === req.user._id.toString();
      if (isCardOwner) {
        card.remove();
        res.send(card);
      } else {
        return next(new ForbiddenError('Чужие карточки удалять нельзя!'));
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Карточки с таким Id нет в базе');
      }
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Некорректный Id карточки');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Карточки с таким Id нет в базе');
      }
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Некорректный Id карточки');
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Карточки с таким Id нет в базе');
      }
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Некорректный Id карточки');
      }
    })
    .catch(next);
};

module.exports = {
  createCard, getAllCards, deleteCard, likeCard, dislikeCard,
};
