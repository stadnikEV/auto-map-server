import getDataOfClosestCoordOnPolyline from '../src/components/map/util/get-data-of-closest-coord-on-polyline';
import getDistanceBetweenPoints from '../src/components/map/util/get-distance-between-points';

export default ({ userDataPassenger }) => {
  /*
  *   найти всех пользователей водителей
  */

  const allDrivers = [];

  const propertyNames = Object.keys(localStorage);
  propertyNames.forEach((name) => {
    if (name === userDataPassenger.userName) return;
    if (name.indexOf('user') !== -1) {
      const userData = JSON.parse(localStorage.getItem(name));
      if (userData.userType !== 'driver') return;
      allDrivers.push(userData);
    }
  });

  /*
  *   поиск водителей с подходящими маршрутами
  */

  const appropriateDrivers = [];

  const pointA = userDataPassenger.passenger.points.A;
  const coordA = pointA.coord;
  const radiusA = pointA.radiusWorldCoord;

  const pointB = userDataPassenger.passenger.points.B;
  const coordB = pointB.coord;
  const radiusB = pointB.radiusWorldCoord;


  allDrivers.forEach((userDriver) => {
    const route = userDriver.driver.polyline.path;
    const stopoverDataA = getDataOfClosestCoordOnPolyline({
      point: coordA,
      polyline: route,
    });
    const stopoverDataB = getDataOfClosestCoordOnPolyline({
      point: coordB,
      polyline: route,
    });

    const stopoverDistA = stopoverDataA.dist;
    const stopoverDistB = stopoverDataB.dist;
    const stopoverSegmentA = stopoverDataA.segment;
    const stopoverSegmentB = stopoverDataB.segment;

    if (stopoverDistA < radiusA
    && stopoverDistB < radiusB
    && stopoverSegmentA[0] < stopoverSegmentB[0]) {
      const userDataDriver = {
        stopoverPoints: {
          A: {},
          B: {},
        },
      };

      userDataDriver.stopoverPoints.A.coord = stopoverDataA.coord;
      userDataDriver.stopoverPoints.B.coord = stopoverDataB.coord;
      userDataDriver.userName = userDriver.userName;

      appropriateDrivers.push(userDataDriver);
    }
  });


  if (appropriateDrivers.length === 0) return null;

  /*
  *   поиск предпочтительного водителя
  *   выбор водителя у которого минимальное расстояние до посадки/выгрузки пассажира
  */

  let preferableDriver;
  let minDist = 256;
  appropriateDrivers.forEach((user) => {
    const distToStart = getDistanceBetweenPoints({
      point1: coordA,
      point2: user.stopoverPoints.A.coord,
    });
    const distToEnd = getDistanceBetweenPoints({
      point1: coordB,
      point2: user.stopoverPoints.B.coord,
    });
    const dist = distToStart + distToEnd;
    if (dist < minDist) {
      minDist = dist;
      preferableDriver = user;
    }
  });

  return preferableDriver;
};
