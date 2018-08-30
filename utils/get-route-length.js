import getDistanceBetweenPoints from '../src/components/map/util/get-distance-between-points';

export default ({ routeDriver, segmentsPassenger }) => {
  const firstSegment = segmentsPassenger[0];
  const lastSegment = segmentsPassenger[1];

  let length = 0;

  for (let i = firstSegment; i < lastSegment; i += 1) {
    const segmentLength = getDistanceBetweenPoints({
      point1: routeDriver[i],
      point2: routeDriver[i + 1],
    });
    length += segmentLength;
  }

  return length;
};
