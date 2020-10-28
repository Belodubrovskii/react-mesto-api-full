const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser, getAllUsers, getUser, updateProfile, updateAvatar, login, getUserInfo,
} = require('../controllers/users.js');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(6).regex(/^\S+$/),
    email: Joi.string().email().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(6).regex(/^\S+$/),
    email: Joi.string().email().required(),
  }),
}), createUser);

router.use(auth);

router.get('/users/me', getUserInfo);

router.get('/users', getAllUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(ftp|http|https):\/\/([-\w.]+)\.([a-z]{2,})(\/|\/([\w#!:.?+=&%@!-/])*)?$/),
  }),
}), updateAvatar);

module.exports = router;
