const degToRad = (deg) => (deg * Math.PI) / 180;

const matrixPoint = (point, contour) => {
  let x = point.x - contour.pivot.x;
  let y = point.y - contour.pivot.y;

  // rotation
  const rad = degToRad(contour.rotation);
  const sinx = x * Math.sin(rad);
  const siny = y * Math.sin(rad);
  const cosx = x * Math.cos(rad);
  const cosy = y * Math.cos(rad);
  x = cosx - siny;
  y = sinx + cosy;

  // scaling
  x *= contour.scaling.x;
  y *= contour.scaling.y;

  // translation
  x += contour.position.x;
  y += contour.position.y;

  return { x, y };
};

const getPointsInOverlapArea = (path, y1, y2) => {
  const points = {};
  path.segments.forEach((seg) => {
    let { x, y } = matrixPoint(seg.point, path.parent);
    x = Math.round(x);
    y = Math.round(y);
    if (y >= y1 && y <= y2) {
      points[y] = points[y] || [];
      points[y].push(x);
    }
  });
  return points;
};

export default function (contour1, contour2, exact = false) {
  if (
    contour2.bounds.left > contour1.bounds.right ||
    contour2.bounds.right < contour1.bounds.left ||
    contour2.bounds.top > contour1.bounds.bottom ||
    contour2.bounds.bottom < contour1.bounds.top
  ) {
    return false;
  }

  if (!exact) return true;

  // overlap area
  const y1 = Math.floor(Math.max(contour1.bounds.top, contour2.bounds.top));
  const y2 = Math.ceil(Math.min(contour1.bounds.bottom, contour2.bounds.bottom));

  for (const path1 of contour1.children) {
    for (const path2 of contour2.children) {
      const points1 = getPointsInOverlapArea(path1, y1, y2);
      const points2 = getPointsInOverlapArea(path2, y1, y2);

      for (let y = y1; y <= y2; y++) {
        if (points1[y] && points2[y]) {
          const p1x1 = Math.min(...points1[y]);
          const p1x2 = Math.max(...points1[y]);
          const p2x1 = Math.min(...points2[y]);
          const p2x2 = Math.max(...points2[y]);
          if (!(p2x1 > p1x2 || p2x2 < p1x1)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}
