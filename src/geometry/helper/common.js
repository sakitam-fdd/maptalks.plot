import * as Constants from '../../Constants'
// import * as maptalks from 'maptalks'
// const Coordinate = maptalks.Coordinate

/**
 * 计算两个坐标之间的距离
 * @param point1
 * @param point2
 * @returns {number}
 * @constructor
 */
const mathDistance = (point1, point2) => {
  return (Math.sqrt(Math.pow((point1['x'] - point2['x']), 2) + Math.pow((point1['y'] - point2['y']), 2)))
}

/**
 * 求取两个坐标的中间值
 * @param point1
 * @param point2
 * @returns {[*,*]}
 * @constructor
 */
const getMiddlePoint = (point1, point2) => {
  return [(point1['x'] + point2['x']) / 2, (point1['y'] + point2['y']) / 2]
}

/**
 * 判断是否是顺时针
 * @param point1
 * @param point2
 * @param point3
 * @returns {boolean}
 */
const isClockWise = (point1, point2, point3) => {
  return ((point3['y'] - point1['y']) * (point2['x'] - point1['x']) > (point2['y'] - point1['y']) * (point3['x'] - point1['x']))
}

/**
 * 获取立方值
 * @param t
 * @param startPnt
 * @param cPnt1
 * @param cPnt2
 * @param endPnt
 * @returns {[*,*]}
 */
const getCubicValue = (t, startPnt, cPnt1, cPnt2, endPnt) => {
  t = Math.max(Math.min(t, 1), 0)
  let [tp, t2] = [(1 - t), (t * t)]
  let t3 = t2 * t
  let tp2 = tp * tp
  let tp3 = tp2 * tp
  let x = (tp3 * startPnt['x']) + (3 * tp2 * t * cPnt1['x']) + (3 * tp * t2 * cPnt2['x']) + (t3 * endPnt['x'])
  let y = (tp3 * startPnt['y']) + (3 * tp2 * t * cPnt1['y']) + (3 * tp * t2 * cPnt2['y']) + (t3 * endPnt['y'])
  return [x, y]
}

/**
 * getBisectorNormals
 * @param t
 * @param point1
 * @param point2
 * @param point3
 * @returns {[*,*]}
 */
const getBisectorNormals = (t, point1, point2, point3) => {
  let normal = getNormal(point1, point2, point3)
  let [bisectorNormalRight, bisectorNormalLeft, dt, x1, y1, x2, y2] = [null, null, null, null, null, null, null]
  let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
  let uX = normal[0] / dist
  let uY = normal[1] / dist
  let d1 = mathDistance(point1, point2)
  let d2 = mathDistance(point2, point3)
  if (dist > Constants.ZERO_TOLERANCE) {
    if (isClockWise(point1, point2, point3)) {
      dt = t * d1
      x1 = point2['x'] - dt * uY
      y1 = point2['y'] + dt * uX
      bisectorNormalRight = [x1, y1]
      dt = t * d2
      x2 = point2['x'] + dt * uY
      y2 = point2['y'] - dt * uX
      bisectorNormalLeft = [x2, y2]
    } else {
      dt = t * d1
      x1 = point2['x'] + dt * uY
      y1 = point2['y'] - dt * uX
      bisectorNormalRight = [x1, y1]
      dt = t * d2
      x2 = point2['x'] - dt * uY
      y2 = point2['y'] + dt * uX
      bisectorNormalLeft = [x2, y2]
    }
  } else {
    x1 = point2['x'] + t * (point1['x'] - point2['x'])
    y1 = point2['y'] + t * (point1['y'] - point2['y'])
    bisectorNormalRight = [x1, y1]
    x2 = point2['x'] + t * (point3['x'] - point2['x'])
    y2 = point2['y'] + t * (point3['y'] - point2['y'])
    bisectorNormalLeft = [x2, y2]
  }
  return [bisectorNormalRight, bisectorNormalLeft]
}

/**
 * 获取默认三点的内切圆
 * @param point1
 * @param point2
 * @param point3
 * @returns {*[]}
 */
const getNormal = (point1, point2, point3) => {
  let dX1 = point1['x'] - point2['x']
  let dY1 = point1['y'] - point2['y']
  let d1 = Math.sqrt(dX1 * dX1 + dY1 * dY1)
  dX1 /= d1
  dY1 /= d1
  let dX2 = point3['x'] - point2['x']
  let dY2 = point3['y'] - point2['y']
  let d2 = Math.sqrt(dX2 * dX2 + dY2 * dY2)
  dX2 /= d2
  dY2 /= d2
  let uX = dX1 + dX2
  let uY = dY1 + dY2
  return [uX, uY]
}

/**
 * 获取左边控制点
 * @param controlPoints
 * @param offset
 * @returns {[*,*]}
 */
const getLeftMostControlPoint = (controlPoints, offset) => {
  let [point1, point2, point3, controlX, controlY] = [controlPoints[0], controlPoints[1], controlPoints[2], null, null]
  let points = getBisectorNormals(0, point1, point2, point3)
  let normalRight = points[0]
  let normal = getNormal(point1, point2, point3)
  let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
  if (dist > Constants.ZERO_TOLERANCE) {
    let mid = getMiddlePoint(point1, point2)
    let pX = point1[0] - mid[0]
    let pY = point1[1] - mid[1]
    let d1 = mathDistance(point1, point2)
    let n = 2.0 / d1
    let nX = -n * pY
    let nY = n * pX
    let a11 = nX * nX - nY * nY
    let a12 = 2 * nX * nY
    let a22 = nY * nY - nX * nX
    let dX = normalRight[0] - mid[0]
    let dY = normalRight[1] - mid[1]
    controlX = mid[0] + a11 * dX + a12 * dY
    controlY = mid[1] + a12 * dX + a22 * dY
  } else {
    controlX = point1[0] + offset * (point2[0] - point1[0])
    controlY = point1[1] + offset * (point2[1] - point1[1])
  }
  return [controlX, controlY]
}

/**
 * 获取右边控制点
 * @param controlPoints
 * @param t
 * @returns {[*,*]}
 */
const getRightMostControlPoint = (controlPoints, t) => {
  let count = controlPoints.length
  let point1 = controlPoints[count - 3]
  let point2 = controlPoints[count - 2]
  let point3 = controlPoints[count - 1]
  let pnts = getBisectorNormals(0, point1, point2, point3)
  let normalLeft = pnts[1]
  let normal = getNormal(point1, point2, point3)
  let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
  let [controlX, controlY] = [null, null]
  if (dist > Constants.ZERO_TOLERANCE) {
    let mid = getMiddlePoint(point2, point3)
    let pX = point3[0] - mid[0]
    let pY = point3[1] - mid[1]
    let d1 = mathDistance(point2, point3)
    let n = 2.0 / d1
    let nX = -n * pY
    let nY = n * pX
    let a11 = nX * nX - nY * nY
    let a12 = 2 * nX * nY
    let a22 = nY * nY - nX * nX
    let dX = normalLeft[0] - mid[0]
    let dY = normalLeft[1] - mid[1]
    controlX = mid[0] + a11 * dX + a12 * dY
    controlY = mid[1] + a12 * dX + a22 * dY
  } else {
    controlX = point3[0] + t * (point2[0] - point3[0])
    controlY = point3[1] + t * (point2[1] - point3[1])
  }
  return [controlX, controlY]
}

/**
 * 插值曲线点
 * @param offset
 * @param controlPoints
 * @returns {null}
 */
const getCurvePoints = (offset, controlPoints) => {
  let leftControl = getLeftMostControlPoint(controlPoints, offset)
  let [point1, point2, point3, normals, points] = [null, null, null, [leftControl], []]
  for (let i = 0; i < controlPoints.length - 2; i++) {
    [point1, point2, point3] = [controlPoints[i], controlPoints[i + 1], controlPoints[i + 2]]
    let normalPoints = getBisectorNormals(offset, point1, point2, point3)
    normals = normals.concat(normalPoints)
  }
  let rightControl = getRightMostControlPoint(controlPoints, offset)
  if (rightControl) {
    normals.push(rightControl)
  }
  for (let i = 0; i < controlPoints.length - 1; i++) {
    point1 = controlPoints[i]
    point2 = controlPoints[i + 1]
    points.push(point1)
    for (let t = 0; t < Constants.FITTING_COUNT; t++) {
      let pnt = getCubicValue(t / Constants.FITTING_COUNT, point1, normals[i * 2], normals[i * 2 + 1], point2)
      points.push(pnt)
    }
    points.push(point2)
  }
  return points
}

export {
  getCurvePoints
}
