const User = require('../models/user');
const HttpError = require('../error');

module.exports = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);

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
