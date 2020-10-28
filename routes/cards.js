const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getAllCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards.js');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/cards', getAllCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^(ftp|http|https):\/\/([-\w.]+)\.([a-z]{2,})(\/|\/([\w#!:.?+=&%@!-/])*)?$/),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
