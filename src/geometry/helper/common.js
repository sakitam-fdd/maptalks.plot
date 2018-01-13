import * as maptalks from 'maptalks'
import {getAzimuth} from './index'
const Coordinate = maptalks.Coordinate

/**
 * 获取两点中间位置
 * @param point1
 * @param point2
 * @returns {*[]}
 */
const getMiddlePoint = (point1, point2) => {
  return [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2]
}

/**
 * 计算距离
 * @param measurer
 * @param pnt1
 * @param pnt2
 * @returns {*}
 */
const mathDistance = (measurer, pnt1, pnt2) => {
  return measurer.measureLength(Coordinate.toCoordinates(pnt1), Coordinate.toCoordinates(pnt2))
}

/**
 * 平面坐标距离
 * @param pnt1
 * @param pnt2
 * @returns {number}
 */
const mathBaseDistance = (pnt1, pnt2) => {
  return (Math.sqrt(Math.pow((pnt1[0] - pnt2[0]), 2) + Math.pow((pnt1[1] - pnt2[1]), 2)))
}

/**
 * 计算点集合的总距离
 * @param measurer
 * @param points
 * @returns {number}
 */
const wholeDistance = (measurer, points) => {
  let distance = 0
  if (points && Array.isArray(points) && points.length > 0) {
    points.forEach((item, index) => {
      if (index < points.length - 1) {
        distance += (mathDistance(measurer, item, points[index + 1]))
      }
    })
  }
  return distance
}
/**
 * 获取基础长度
 * @param measurer
 * @param points
 * @returns {number}
 */
const getBaseLength = (measurer, points) => {
  return Math.pow(wholeDistance(measurer, points), 0.99)
}

/**
 * 根据起止点和旋转方向求取第三个点
 * @param measurer
 * @param startPnt
 * @param endPnt
 * @param angle
 * @param distance
 * @param clockWise
 * @returns {[*,*]}
 */
const getThirdPoint = (measurer, startPnt, endPnt, angle, distance, clockWise) => {
  let azimuth = getAzimuth(measurer, startPnt, endPnt)
  let alpha = clockWise ? (azimuth + angle) : (azimuth - angle)
  let dx = distance * Math.cos(alpha)
  let dy = distance * Math.sin(alpha)
  const vertex = measurer.locate({
    'x': endPnt[0],
    'y': endPnt[1]
  }, dx, dy)
  return [vertex['x'], vertex['y']]
}

/**
 * 插值弓形线段点
 * @param measurer
 * @param center
 * @param radius
 * @param startAngle
 * @param endAngle
 * @param numberOfPoints
 * @returns {null}
 */
const getArcPoints = (measurer, center, radius, startAngle, endAngle, numberOfPoints = 100) => {
  let [dx, dy, points, angleDiff] = [null, null, [], (endAngle - startAngle)]
  angleDiff = ((angleDiff < 0) ? (angleDiff + (Math.PI * 2)) : angleDiff)
  for (let i = 0; i < numberOfPoints; i++) {
    const rad = angleDiff * i / numberOfPoints + startAngle
    dx = radius * Math.cos(rad)
    dy = radius * Math.sin(rad)
    const vertex = measurer.locate({
      'x': center[0],
      'y': center[1]
    }, dx, dy)
    points.push([vertex['x'], vertex['y']])
  }
  return points
}

export {
  getMiddlePoint,
  getAzimuth,
  mathDistance,
  wholeDistance,
  getBaseLength,
  getArcPoints,
  getThirdPoint,
  mathBaseDistance
}
