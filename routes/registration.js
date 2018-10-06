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
  const userName = req.body.userName;
  const password = req.body.password;

  User.findOne({ email })
    .then((email) => {
      if (email) {
      return Promise.reject(new HttpError({
          status: 403,
          message: 'The user was not created',
        }));
      }
    })
    .then(() => {
      const user = new User({
        email,
        userName,
        password,
        userStatus: 'login',
      });

      return user.save();
    })
    .then((user) => {
      req.session.userId = user._id;
      req.session.app = app;
      res.json({});
    })
    .catch((err) => {
      next(err);
    });
}
