module.exports = (app) => {
  app.get('/driver/userStatus', require('./user-status'));
  app.post('/driver/registration', require('./registration'));
  app.post('/driver/login', require('./login'));
  app.post('/driver/putMapData', require('./put-map-data'));
  app.get('/driver/getMapData', require('./get-map-data'));

  app.get('/passenger/userStatus', require('./user-status'));
  app.post('/passenger/registration', require('./registration'));
  app.post('/passenger/login', require('./login'));
  app.post('/passenger/putMapData', require('./put-map-data'));
  app.get('/passenger/getMapData', require('./get-map-data'));
}
