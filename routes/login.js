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

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'not valid email or password',
        }));
      }
      return user;
    })
    .then((user) => {
      if (!user.checkPassword(password)) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'not valid email or password',
        }));
      }
      return user;
    })
    .then((user) => {
      req.session.userId = user._id;
      req.session.app = app;
      user.userStatus = 'login';
      return user.save();
    })
    .then(() => {
      res.json({});
    })
    .catch((err) => {
      next(err);
    });
}
