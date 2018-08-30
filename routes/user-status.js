const User = require('../models/user');

const userStatus = (req, res, next) => {
  console.log('userId: ' + req.session.userId);
  if (!req.session.userId) {
    res.json({
      "status": "unknown"
    });
    return;
  }

  User.findById(req.session.userId)
    .then((user) => {
      res.json({
        "status": user.userStatus,
      });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = userStatus;
