var crypto = require('crypto');

var mongoose = require('../libs/mongoose'),
Schema = mongoose.Schema;

var schema = new Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  userStatus: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  mapData: {
    points: {
      A: {
        coord: {
          x: Number,
          y: Number,
        }
      },
      B: {
        coord: {
          x: Number,
          y: Number,
        }
      }
    },
    polyline: {
      path: [
        {
          x: Number,
          y: Number,
        }
      ],
    },
    waypoints: {
      coord: [
        {
          location: {
            x: Number,
            y: Number,
          },
          stopover: Boolean,
        }
      ],
      id: [
        Number,
      ],
    },
  }
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

const UserDriver = mongoose.model('UserDriver', schema);

module.exports = UserDriver;
