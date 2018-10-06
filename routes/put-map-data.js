const defineApp = require('../utils/define-app');
const HttpError = require('../error');

module.exports = (req, res, next) => {
  let User = null;
  let app = defineApp(req.url);

  if (app === 'driver') {
    User = require('../models/user-driver');
  } else {
    User = require('../models/user-passenger');
  }


  if (!req.session.userId || req.session.app !== app) {
    next(new HttpError({
      status: 403,
      message: 'Access denied. Unknown user',
    }));
    return;
  }

  User.findById(req.session.userId)
    .then((user) => {
      let errorMessage = null;
      if (user.userStatus === 'logout') {
        errorMessage = 'Access denied. Please log in';
      }
      if (user.userStatus === 'search') {
        errorMessage = 'Access denied. Impossible to change the route in the search mode'; // возможно можно изменять при условиях!!!
      }
      if (user.userStatus === 'connect') {
        errorMessage = 'Access denied. Impossible to change the route in the connect mode'; // возможно можно изменять при условиях!!!
      }
      if (errorMessage) {
        return Promise.reject(new HttpError({
          status: 403,
          message: errorMessage,
        }));
      }
      user.mapData = req.body;

      return user.save();
    })
    .catch((err) => {
      console.log(err.status);
      next(err);
    });
}
