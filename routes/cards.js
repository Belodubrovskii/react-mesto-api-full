const router = require('express').Router();
const path = require('path');
const { getJsonFromFile } = require('../helpers/read-file.js');

router.get('/cards', (req, res) => getJsonFromFile(path.join(__dirname, '..', 'data/cards.json'))
  .then((data) => {
    if (!data) {
      res
        .status(500)
        .send({ message: 'Запрашиваемый ресурс не найден' });
      return;
    }

    res
      .status(200)
      .send(data);
  }));

module.exports = router;
