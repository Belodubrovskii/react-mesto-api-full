/* eslint-disable consistent-return */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data');
const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name = 'User', about = 'Something cool', avatar = 'https://pictures.s3.yandex.net/frontend-developer/ava.jpg', email, password,
  } = req.body;

  if (!(email && password)) {
    return next(new IncorrectDataError('Поля email и password должны быть заполнены!'));
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then(() => res.send({ data: 'Вы успешно зарегистрировались' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Переданны некорректные данные');
      } else if (err.name === 'MongoError') {
        throw new IncorrectDataError('Пользователь с таким email уже зарегистрирован');
      }
      throw err;
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return next(new IncorrectDataError('Поля email и password должны быть заполнены!'));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError('Необходима авторизация')))
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Некорректный Id пользователя');
      }
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log('dffd')
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Некорректный Id пользователя');
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { name, about },
    { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Некорректный Id пользователя');
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { avatar },
    { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Некорректный Id пользователя');
      }
    })
    .catch(next);
};

module.exports = {
  createUser, getAllUsers, getUser, updateProfile, updateAvatar, login, getUserInfo,
};
