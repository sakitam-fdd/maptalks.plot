/**
 * Created by FDD on 2017/12/31.
 * @desc 进攻方向（尾）
 * @Inherits AttackArrow
 */

import AttackArrow from './AttackArrow'
import * as maptalks from 'maptalks'
import {
  isClockWise,
  getBaseLength,
  getThirdPoint,
  getQBSplinePoints,
  MathDistance,
  Mid
} from '../helper/index'
const Coordinate = maptalks.Coordinate

class TailedAttackArrow extends AttackArrow {
  constructor (coordinates, options = {}) {
    super(coordinates, options)
    this.type = 'TailedAttackArrow'
    this._coordinates = []
    this.headHeightFactor = 0.18
    this.headWidthFactor = 0.3
    this.neckHeightFactor = 0.85
    this.neckWidthFactor = 0.15
    this.tailWidthFactor = 0.1
    this.headTailFactor = 0.8
    this.swallowTailFactor = 1
    this.swallowTailPnt = null
    if (coordinates) {
      this.setPoints(coordinates)
    }
  }

  /**
   * 处理插值
   */
  _generate () {
    try {
      const count = this._coordinates.length
      if (count < 2) return
      if (count === 2) {
        this.setCoordinates([this._coordinates])
      } else {
        let _points = Coordinate.toNumberArrays(this._coordinates)
        let [tailLeft, tailRight] = [_points[0], _points[1]]
        if (isClockWise(_points[0], _points[1], _points[2])) {
          tailLeft = _points[1]
          tailRight = _points[0]
        }
        let midTail = Mid(tailLeft, tailRight)
        let bonePoints = [midTail].concat(_points.slice(2))
        let headPoints = this._getArrowHeadPoints(bonePoints, tailLeft, tailRight)
        let [neckLeft, neckRight] = [headPoints[0], headPoints[4]]
        let tailWidth = MathDistance(tailLeft, tailRight)
        let allLen = getBaseLength(bonePoints)
        let len = allLen * this.tailWidthFactor * this.swallowTailFactor
        this.swallowTailPnt = getThirdPoint(bonePoints[1], bonePoints[0], 0, len, true)
        let factor = tailWidth / allLen
        let bodyPoints = AttackArrow._getArrowBodyPoints(bonePoints, neckLeft, neckRight, factor)
        let count = bodyPoints.length
        let leftPoints = [tailLeft].concat(bodyPoints.slice(0, count / 2))
        leftPoints.push(neckLeft)
        let rightPoints = [tailRight].concat(bodyPoints.slice(count / 2, count))
        rightPoints.push(neckRight)
        leftPoints = getQBSplinePoints(leftPoints)
        rightPoints = getQBSplinePoints(rightPoints)
        this.setCoordinates(Coordinate.toCoordinates([leftPoints.concat(headPoints, rightPoints.reverse(), [this.swallowTailPnt, leftPoints[0]])]))
      }
    } catch (e) {
      console.log(e)
    }
  }

  _toJSON (options) {
    const opts = maptalks.Util.extend({}, options)
    opts.geometry = false
    const feature = this.toGeoJSON(opts)
    return {
      'feature': feature,
      'coordinates': feature['coordinates'],
      'subType': 'TailedAttackArrow'
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const _geometry = new TailedAttackArrow(json['coordinates'], json['options'])
    _geometry.setProperties(feature['properties'])
    return _geometry
  }
}

TailedAttackArrow.registerJSONType('TailedAttackArrow')

export default TailedAttackArrow
