const Card = require('../models/card.js');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Карточки с таким Id нет в базе' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный Id карточки' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Карточки с таким Id нет в базе' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный Id карточки' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Карточки с таким Id нет в базе' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный Id карточки' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  createCard, getAllCards, deleteCard, likeCard, dislikeCard,
};
