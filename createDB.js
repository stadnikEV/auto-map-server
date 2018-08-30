const mongoose = require('./libs/mongoose');
// mongoose.set('debug', true);

const dropDatabase = () => {
  return new Promise((resolve) => {
    const db = mongoose.connection.db;
    db.dropDatabase();
    resolve();
  });
}

mongoose.connection.on('open', () => {
  dropDatabase()
  .then(() => {
    require('./models/user.js');
    const user1 = new mongoose.models.User({ username: 'user1',  password: 'secret1' });
    return user1.save();
  })
  .then(() => {
    require('./models/user.js');
    const user2 = new mongoose.models.User({ username: 'user2',  password: 'secret1' });
    return user2.save();
  })
  .then(() => {
    require('./models/user.js');
    const user3 = new mongoose.models.User({ username: 'user3',  password: 'secret1' });
    return user3.save();
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch((err) => {
    console.log('Ошибка: ' + err);
    mongoose.disconnect();
  })
});


// mongoose.connect('mongodb://localhost/drivers')
//   .then(() => {
//     return dropDatabase();
//   })
//   .then(() => {
//     require('./models/user.js');
//     const user1 = new mongoose.models.User({ username: 'user1',  password: 'secret1' });
//     return user1.save();
//   })
//   .then(() => {
//     require('./models/user.js');
//     const user2 = new mongoose.models.User({ username: 'user2',  password: 'secret1' });
//     return user2.save();
//   })
//   .then(() => {
//     require('./models/user.js');
//     const user3 = new mongoose.models.User({ username: 'user3',  password: 'secret1' });
//     return user3.save();
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch((err) => {
//     console.log('Ошибка: ' + err);
//     mongoose.disconnect();
//   })
































// const open = () => {
//   return new Promise((resolve, reject) => {
//     mongoose.connection.on('open', (err) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve();
//     });
//   });
// }
//
// const dropDatabase = () => {
//   return new Promise((resolve, reject) => {
//     const db = mongoose.connection.db;
//     db.dropDatabase((err) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve();
//     });
//   });
// }
//
// /*
// *   получение массива промисов для функций  mongoose.models[modelName].ensureIndexes
// *   эти функции вызывают callback когда все индексы для models будут созданы
// */
//
// const getPromiseEnsureIndexes = () => {
//   const asyncFunc = [];
//   Object.keys(mongoose.models)
//     .forEach((modelName) => {
//       const promise = new Promise((resolve, reject) => {
//         mongoose.models[modelName].ensureIndexes((err) => {
//           if (err) {
//             reject(err);
//             return;
//           }
//           resolve();
//         });
//       });
//       asyncFunc.push(promise);
//     });
//
//   return asyncFunc;
// }
//
//
// const saveUser = (user) => {
//   return new Promise((resolve, reject) => {
//     user.save((err, user) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(user);
//     });
//   });
// };
//
// const createUsers = () => {
//   return Promise.all([
//     saveUser(new User({ username: 'user1',  password: 'secret1' })),
//     saveUser(new User({ username: 'user2',  password: 'secret2' })),
//     saveUser(new User({ username: 'user3',  password: 'secret3' })),
//   ])
// }
//
// // подключение models. Ожидание создания  индексов для всех models
// const requireModels = () => {
//   require('./models/user.js');
//   return Promise.all(getPromiseEnsureIndexes());
// }
//
// const close = () => {
//   mongoose.disconnect();
// }
//
//
// open()
//   .then(() => dropDatabase())
//   .then(() => requireModels())
//   .then(() =>  createUsers())
//   .then(() => close())
//   .catch((err) => {
//     close();
//     console.log('error:', err);
//   });
