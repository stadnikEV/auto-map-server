import searchDrivers from './search-drivers';
import searchPassengers from './search-passengers';

export default ({ url, dataRequestJSON }) => {
  const promise = new Promise((resolve) => {
    const dataRequest = JSON.parse(dataRequestJSON);

    let userDataDBJson = localStorage.getItem(dataRequest.userName);
    const userDataDB = JSON.parse(userDataDBJson);


    /*
    *   вход в приложение
    */

    if (url === './login') {
      // если пользователь не зарегистрирован
      if (userDataDBJson === null) {
        setTimeout(() => {
          resolve(JSON.stringify({ userName: false }));
        }, 1000);

        return;
      }


      // не данных о режиме приложения (passenger или driver), приложением еще не пользовались
      if (!userDataDB.userType) {
        userDataDB.userType = false;
        localStorage.setItem(dataRequest.userName, userDataDB);

        setTimeout(() => {
          resolve(localStorage.getItem(dataRequest.userName));
        }, 1000);

        return;
      }

      // отдать данные приложению если на сервере инициализирован режим 'passenger'
      if (userDataDB.userType === 'passenger') {
        const responseData = {
          userName: dataRequest.userName,
          userType: 'passenger',
          passenger: userDataDB.passenger,
        };

        setTimeout(() => {
          resolve(JSON.stringify(responseData));
        }, 1000);
        return;
      }

      // отдать данные приложению если на сервере инициализирован режим 'driver'
      if (userDataDB.userType === 'driver') {
        const responseData = {
          userName: dataRequest.userName,
          userType: 'driver',
          driver: userDataDB.driver,
        };

        setTimeout(() => {
          resolve(JSON.stringify(responseData));
        }, 1000);
        return;
      }
    }

    /*
    *   регистрация пользователя
    */

    if (url === './registartion') {
      localStorage.setItem(dataRequest.userName, `{ "userName": "${dataRequest.userName}", "userType": false }`);
      setTimeout(() => {
        resolve(localStorage.getItem(dataRequest.userName));
      }, 1000);

      return;
    }

    /*
    *   сохранение данных в базу
    */

    // получить данные для выбранного режима "userType"
    if (url === './userType') {
      userDataDB.userType = dataRequest.userType;

      userDataDBJson = JSON.stringify(userDataDB);

      localStorage.setItem(dataRequest.userName, userDataDBJson);

      setTimeout(() => {
        resolve(localStorage.getItem(dataRequest.userName));
      }, 1000);

      return;
    }

    // сохранение данных для режтма "passenger"
    if (url === './passenger/save-data') {
      userDataDB.userType = 'passenger';
      userDataDB.passenger = dataRequest.passenger;

      userDataDBJson = JSON.stringify(userDataDB);
      localStorage.setItem(dataRequest.userName, userDataDBJson);

      setTimeout(() => {
        resolve('data was saved');
      }, 1000);
    }


    // сохранение данных для режтма "driver"
    if (url === './driver/save-data') {
      userDataDB.userType = 'driver';
      userDataDB.driver = dataRequest.driver;

      userDataDBJson = JSON.stringify(userDataDB);
      localStorage.setItem(dataRequest.userName, userDataDBJson);

      setTimeout(() => {
        resolve('data was saved');
      }, 1000);
    }

    /*
    *   поиск для пассажира маршрутов
    */

    if (url === './passenger/start-search') {
      userDataDB.userType = 'passenger';
      userDataDB.passenger = dataRequest.passenger;

      userDataDBJson = JSON.stringify(userDataDB);
      localStorage.setItem(dataRequest.userName, userDataDBJson);

      setTimeout(() => {
        const userDataDriver = searchDrivers({
          userDataPassenger: dataRequest,
        });

        if (!userDataDriver) {
          resolve('matches was not found');
          return;
        }

        resolve(userDataDriver);
      }, 1000);
    }

    /*
    *   поиск для водителя пассажиров
    */

    if (url === './driver/start-search') {
      userDataDB.userType = 'driver';
      userDataDB.driver = dataRequest.driver;

      userDataDBJson = JSON.stringify(userDataDB);
      localStorage.setItem(dataRequest.userName, userDataDBJson);

      setTimeout(() => {
        const userDataPassenger = searchPassengers({
          userDataDriver: dataRequest,
        });

        if (!userDataPassenger) {
          resolve('matches was not found');
          return;
        }

        resolve(userDataPassenger);
      }, 1000);
    }
  });


  return promise;
};
