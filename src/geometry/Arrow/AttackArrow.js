/**
 * Created by FDD on 2017/12/26.
 * @desc 进攻方向
 * @Inherits maptalks.Polygon
 */

import * as maptalks from 'maptalks'
import * as Constants from '../../Constants'
import {
  Mid,
  getThirdPoint,
  MathDistance,
  getBaseLength,
  wholeDistance,
  isClockWise,
  getQBSplinePoints,
  getAngleOfThreePoints
} from '../helper/index'
const Coordinate = maptalks.Coordinate
// FIXME error
class AttackArrow extends maptalks.Polygon {
  constructor (coordinates, points, options = {}) {
    super(options)
    this.type = 'AttackArrow'
    this._coordinates = []
    this.headHeightFactor = 0.18
    this.headWidthFactor = 0.3
    this.neckHeightFactor = 0.85
    this.neckWidthFactor = 0.15
    this.headTailFactor = 0.8
    this._points = points || []
    if (coordinates) {
      this.setCoordinates(coordinates)
    }
  }

  /**
   * 处理插值
   */
  _generate () {
    try {
      const count = this._points.length
      if (count < 2) return
      if (count === 2) {
        this.setCoordinates([this._points])
      } else {
        let _points = Coordinate.toNumberArrays(this._points)
        let [tailLeft, tailRight] = [_points[0], _points[1]]
        if (isClockWise(_points[0], _points[1], _points[2])) {
          tailLeft = _points[1]
          tailRight = _points[0]
        }
        let midTail = Mid(tailLeft, tailRight)
        let bonePoints = [midTail].concat(_points.slice(2))
        let headPoints = this._getArrowHeadPoints(bonePoints, tailLeft, tailRight)
        let [neckLeft, neckRight] = [headPoints[0], headPoints[4]]
        let tailWidthFactor = MathDistance(tailLeft, tailRight) / getBaseLength(bonePoints)
        let bodyPoints = AttackArrow._getArrowBodyPoints(bonePoints, neckLeft, neckRight, tailWidthFactor)
        let count = bodyPoints.length
        let leftPoints = [tailLeft].concat(bodyPoints.slice(0, count / 2))
        leftPoints.push(neckLeft)
        let rightPoints = [tailRight].concat(bodyPoints.slice(count / 2, count))
        rightPoints.push(neckRight)
        leftPoints = getQBSplinePoints(leftPoints)
        rightPoints = getQBSplinePoints(rightPoints)
        this.setCoordinates([
          Coordinate.toCoordinates(leftPoints.concat(headPoints, rightPoints.reverse()))
        ])
      }
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 插值头部点
   * @param points
   * @param tailLeft
   * @param tailRight
   * @returns {*[]}
   */
  _getArrowHeadPoints (points, tailLeft, tailRight) {
    let len = getBaseLength(points)
    let headHeight = len * this.headHeightFactor
    let headPnt = points[points.length - 1]
    len = MathDistance(headPnt, points[points.length - 2])
    let tailWidth = MathDistance(tailLeft, tailRight)
    if (headHeight > tailWidth * this.headTailFactor) {
      headHeight = tailWidth * this.headTailFactor
    }
    let headWidth = headHeight * this.headWidthFactor
    let neckWidth = headHeight * this.neckWidthFactor
    headHeight = headHeight > len ? len : headHeight
    let neckHeight = headHeight * this.neckHeightFactor
    let headEndPnt = getThirdPoint(points[points.length - 2], headPnt, 0, headHeight, true)
    let neckEndPnt = getThirdPoint(points[points.length - 2], headPnt, 0, neckHeight, true)
    let headLeft = getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, false)
    let headRight = getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, true)
    let neckLeft = getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, false)
    let neckRight = getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, true)
    return [neckLeft, headLeft, headPnt, headRight, neckRight]
  }

  /**
   * 获取geom类型
   * @returns {string}
   */
  getPlotType () {
    return this.type
  }

  /**
   * 获取控制点
   * @returns {Array|*}
   */
  getPoints () {
    return this._points
  }

  /**
   * set point
   * @param coordinates
   */
  setPoints (coordinates) {
    this._points = !coordinates ? [] : coordinates
    if (this._points.length >= 1) {
      this._generate()
    }
  }

  _exportGeoJSONGeometry () {
    const coordinates = Coordinate.toNumberArrays([this.getShell()])
    return {
      'type': 'Polygon',
      'coordinates': coordinates
    }
  }

  _toJSON (options) {
    const opts = maptalks.Util.extend({}, options)
    const coordinates = this.getCoordinates()
    opts.geometry = false
    const feature = this.toGeoJSON(opts)
    feature['geometry'] = {
      'type': 'Polygon'
    }
    return {
      'feature': feature,
      'subType': 'AttackArrow',
      'coordinates': coordinates,
      'points': this.getPoints()
    }
  }

  /**
   * 插值面部分数据
   * @param points
   * @param neckLeft
   * @param neckRight
   * @param tailWidthFactor
   * @returns {*|T[]|string}
   */
  static _getArrowBodyPoints (points, neckLeft, neckRight, tailWidthFactor) {
    let allLen = wholeDistance(points)
    let len = getBaseLength(points)
    let tailWidth = len * tailWidthFactor
    let neckWidth = MathDistance(neckLeft, neckRight)
    let widthDif = (tailWidth - neckWidth) / 2
    let [tempLen, leftBodyPoints, rightBodyPoints] = [0, [], []]
    for (let i = 1; i < points.length - 1; i++) {
      let angle = getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2
      tempLen += MathDistance(points[i - 1], points[i])
      let w = (tailWidth / 2 - tempLen / allLen * widthDif) / Math.sin(angle)
      let left = getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true)
      let right = getThirdPoint(points[i - 1], points[i], angle, w, false)
      leftBodyPoints.push(left)
      rightBodyPoints.push(right)
    }
    return leftBodyPoints.concat(rightBodyPoints)
  }

  static fromJSON (json) {
    const feature = json['feature']
    const _geometry = new AttackArrow(json['coordinates'], json['points'], json['options'])
    _geometry.setProperties(feature['properties'])
    return _geometry
  }
}

AttackArrow.registerJSONType('AttackArrow')

export default AttackArrow
