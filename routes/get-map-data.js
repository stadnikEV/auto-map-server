const defineApp = require('../utils/define-app');
const HttpError = require('../error');

const userStatus = (req, res, next) => {
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
      message: 'Access denied. Please log in',
    }));
    return;
  }

  User.findById(req.session.userId)
    .then((user) => {
      res.json(user.mapData);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = userStatus;
