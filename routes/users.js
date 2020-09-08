const router = require('express').Router();
const path = require('path');
const { getJsonFromFile } = require('../helpers/read-file.js');

router.get('/users/:id', (req, res) => {
  return getJsonFromFile(path.join(__dirname, '..', 'data/users.json'))
    .then(data => {
      if (!data) {
        res
          .status(500)
          .send({ "message": "Запрашиваемый ресурс не найден" })
        return;
      }

      const foundUser = data.find((user) => user._id === req.params.id);

      if (!foundUser) {
        res
          .status(404)
          .send({ "message": "Нет пользователя с таким id" })
        return;
      }

      res
        .status(200)
        .send(foundUser)
    })
})

router.get('/users', (req, res) => {
  return getJsonFromFile(path.join(__dirname, '..', 'data/users.json'))
    .then(data => {
      if (!data) {
        res
          .status(500)
          .send({ "message": "Запрашиваемый ресурс не найден" })
        return;
      }

      res
        .status(200)
        .send(data)
    })
})

module.exports = router;