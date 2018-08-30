const User = require('../models/user');
const HttpError = require('../error');

module.exports = (req, res, next) => {
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;
  console.log(userName, email, password);

  User.findOne({ email })
    .then((email) => {
      if (email) {
      return Promise.reject(new HttpError({
          status: 403,
          message: 'The user was not created',
        }));
      }
      return;
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
      res.json({});
    })
    .catch((err) => {
      next(err);
    });
}
