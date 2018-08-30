import getDataOfClosestCoordOnPolyline from '../src/components/map/util/get-data-of-closest-coord-on-polyline';
import getRouteLength from './get-route-length';

export default ({ userDataDriver }) => {
  const route = userDataDriver.driver.polyline.path;
  const allPassengers = [];
  const appropriatePassengers = [];
  /*
  *   найти всех пользователей пассажиров
  */

  const propertyNames = Object.keys(localStorage);
  propertyNames.forEach((name) => {
    if (name === userDataDriver.userName) return;

    if (name.indexOf('user') !== -1) {
      const userData = JSON.parse(localStorage.getItem(name));
      if (userData.userType !== 'passenger') return;
      allPassengers.push(userData);
    }
  });

  /*
  *   поиск пассажиров с подходящими маршрутами
  */

  allPassengers.forEach((userPassenger) => {
    const pointA = userPassenger.passenger.points.A;
    const coordA = pointA.coord;
    const radiusA = pointA.radiusWorldCoord;

    const pointB = userPassenger.passenger.points.B;
    const coordB = pointB.coord;
    const radiusB = pointB.radiusWorldCoord;

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
      const userDataPassenger = {
        stopoverPoints: {
          A: {},
          B: {},
        },
      };

      userDataPassenger.stopoverPoints.A.coord = stopoverDataA.coord;
      userDataPassenger.stopoverPoints.B.coord = stopoverDataB.coord;

      userDataPassenger.userName = userPassenger.userName;

      const routeLength = getRouteLength({
        routeDriver: route,
        segmentsPassenger: [stopoverSegmentA[0], stopoverSegmentB[0]],
      });

      userDataPassenger.routeLength = routeLength;

      appropriatePassengers.push(userDataPassenger);
    }
  });

  if (appropriatePassengers.length === 0) return null;

  /*
  *   поиск предпочтительного пассажира
  *   приоритет пассажира который проезжает большее расстояние
  */

  const compareNumeric = (a, b) => {
    if (a.routeLength < b.routeLength) return 1;
    return -1;
  };

  appropriatePassengers.sort(compareNumeric);

  /*
  *   удалить из appropriatePassengers данные о длине маршрута
  */

  appropriatePassengers.forEach((userDataPassenger) => {
    delete userDataPassenger.routeLength;
  });


  return appropriatePassengers;
};
