/**
 * Created by FDD on 2017/12/26.
 * @desc 分队战斗行动
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

class SquadCombat extends AttackArrow {
  constructor (coordinates, options = {}) {
    super(coordinates, options)
    this.type = 'SquadCombat'
    this._coordinates = []
    this.headHeightFactor = 0.18
    this.headWidthFactor = 0.3
    this.neckHeightFactor = 0.85
    this.neckWidthFactor = 0.15
    this.tailWidthFactor = 0.1
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
        let tailPoints = this.getTailPoints(_points)
        let headPoints = this._getArrowHeadPoints(_points, tailPoints[0], tailPoints[1])
        let neckLeft = headPoints[0]
        let neckRight = headPoints[4]
        let bodyPoints = AttackArrow._getArrowBodyPoints(_points, neckLeft, neckRight, this.tailWidthFactor)
        let count = bodyPoints.length
        let leftPoints = [tailPoints[0]].concat(bodyPoints.slice(0, count / 2))
        leftPoints.push(neckLeft)
        let rightPoints = [tailPoints[1]].concat(bodyPoints.slice(count / 2, count))
        rightPoints.push(neckRight)
        leftPoints = getQBSplinePoints(leftPoints)
        rightPoints = getQBSplinePoints(rightPoints)
        this.setCoordinates(Coordinate.toCoordinates([leftPoints.concat(headPoints, rightPoints.reverse())]))
      }
    } catch (e) {
      console.log(e)
    }
  }

  getTailPoints (points) {
    let allLen = getBaseLength(points)
    let tailWidth = allLen * this.tailWidthFactor
    let tailLeft = getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, false)
    let tailRight = getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, true)
    return ([tailLeft, tailRight])
  }

  _toJSON (options) {
    const opts = maptalks.Util.extend({}, options)
    opts.geometry = false
    const feature = this.toGeoJSON(opts)
    return {
      'feature': feature,
      'coordinates': feature['coordinates'],
      'subType': 'SquadCombat'
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const squadCombat = new SquadCombat(json['coordinates'], json['options'])
    squadCombat.setProperties(feature['properties'])
    return squadCombat
  }
}

SquadCombat.registerJSONType('SquadCombat')

export default SquadCombat
