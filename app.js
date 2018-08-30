const express = require('express');
const http = require('http');
const HttpError = require('./error');
const session = require('express-session'); // middleware позволяющий отслеживать посетителей через cookie
const MongoStore = require('connect-mongo')(session); // сохранение и загрузка сессий в базу данных
const config = require('./config');
const logger = require('./libs/log'); // логирование в консоль
const mongoose = require('./libs/mongoose');
const morgan = require('morgan'); // логирование запросов с клиента в консоль
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const allowCrossDomain = require('./middleware/allow-cross-domain.js');


const app = express();
app.set('port', config.get('port'));

app.use(morgan('tiny')); // логирование запросов с клиента в консоль

app.use(cookieParser());
app.use(bodyParser.json());
app.use(allowCrossDomain); // разрешает кросдоменный запрос и передачу cookie

app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  resave: config.get('session:resave'),
  saveUninitialized: config.get('session:saveUninitialized'),
  cookie: config.get('session:cookie'),
  store: new MongoStore({
    mongooseConnection: mongoose.connection, // MongoStore берет настройки для подключения к базе из mongoose
  }),
}));




require('./routes')(app);






/*
*   перехват ошибок
*/

app.use((err, req, res, next) => {
  let error = err;

  if (error instanceof HttpError) {
    res.status(error.status);
    res.json(error);
    return;
  }
  res.status(500);
  res.json(new HttpError({
    status: 500,
  }));
  logger.error(err.stack);
  return;
});


http.createServer(app).listen(config.get('port'), () => {
  logger.info('Express server listening on port ' + config.get('port'));
});
