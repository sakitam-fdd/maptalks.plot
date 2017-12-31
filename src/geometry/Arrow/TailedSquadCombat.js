/**
 * Created by FDD on 2017/12/31.
 * @desc 燕尾直箭头
 * @Inherits AttackArrow
 */

import AttackArrow from './AttackArrow'
import * as maptalks from 'maptalks'
import * as Constants from '../../Constants'
import {
  getBaseLength,
  getThirdPoint,
  getQBSplinePoints
} from '../helper/index'
const Coordinate = maptalks.Coordinate

class TailedSquadCombat extends AttackArrow {
  constructor (coordinates, options = {}) {
    super(coordinates, options)
    this.type = 'TailedSquadCombat'
    this._coordinates = []
    this.headHeightFactor = 0.18
    this.headWidthFactor = 0.3
    this.neckHeightFactor = 0.85
    this.neckWidthFactor = 0.15
    this.tailWidthFactor = 0.1
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
      const _points = Coordinate.toNumberArrays(this._coordinates)
      if (count < 2) return
      let tailPoints = this.getTailPoints(_points)
      let headPoints = this._getArrowHeadPoints(_points, tailPoints[0], tailPoints[2])
      let neckLeft = headPoints[0]
      let neckRight = headPoints[4]
      let bodyPoints = AttackArrow._getArrowBodyPoints(_points, neckLeft, neckRight, this.tailWidthFactor)
      let _count = bodyPoints.length
      let leftPoints = [tailPoints[0]].concat(bodyPoints.slice(0, _count / 2))
      leftPoints.push(neckLeft)
      let rightPoints = [tailPoints[2]].concat(bodyPoints.slice(_count / 2, _count))
      rightPoints.push(neckRight)
      leftPoints = getQBSplinePoints(leftPoints)
      rightPoints = getQBSplinePoints(rightPoints)
      this.setCoordinates(Coordinate.toCoordinates([leftPoints.concat(headPoints, rightPoints.reverse(), [tailPoints[1], leftPoints[0]])]))
    } catch (e) {
      console.warn(e)
    }
  }

  getTailPoints (points) {
    let allLen = getBaseLength(points)
    let tailWidth = allLen * this.tailWidthFactor
    let tailLeft = getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, false)
    let tailRight = getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, true)
    let len = tailWidth * this.swallowTailFactor
    let swallowTailPnt = getThirdPoint(points[1], points[0], 0, len, true)
    return ([tailLeft, swallowTailPnt, tailRight])
  }

  _toJSON (options) {
    const opts = maptalks.Util.extend({}, options)
    opts.geometry = false
    const feature = this.toGeoJSON(opts)
    return {
      'feature': feature,
      'coordinates': feature['coordinates'],
      'subType': 'TailedSquadCombat'
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const _geometry = new TailedSquadCombat(json['coordinates'], json['options'])
    _geometry.setProperties(feature['properties'])
    return _geometry
  }
}

TailedSquadCombat.registerJSONType('TailedSquadCombat')

export default TailedSquadCombat
