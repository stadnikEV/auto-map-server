module.exports = (app) => {
  app.get('/userStatus', require('./user-status'));
  app.post('/registration', require('./registration'));
  app.post('/login', require('./login'));
}
