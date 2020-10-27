const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
const IncorrectDataError = require('./errors/incorrect-data');

const app = express();

const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  if (err.name === 'SyntaxError') {
    return next(new IncorrectDataError('Невалидный JSON'));
  }
  return next();
});

const { PORT = 3000 } = process.env;

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(
  usersRouter,
);

app.use(
  cardsRouter,
);

app.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
