/**
 * Created by FDD on 2017/12/26.
 * @desc 弓形
 * @Inherits maptalks.Polygon
 */
import * as maptalks from 'maptalks'
import * as Constants from '../../Constants'
import {
  Mid,
  getThirdPoint,
  MathDistance,
  isClockWise,
  getAzimuth,
  getArcPoints,
  getCircleCenterOfThreePoints
} from '../helper/index'
const Coordinate = maptalks.Coordinate
class Lune extends maptalks.Polygon {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'Lune'
    this._coordinates = []
    if (coordinates) {
      this.setPoints(coordinates)
    }
  }

  /**
   * handle coordinates
   * @private
   */
  _generate () {
    const count = this._coordinates.length
    let _points = Coordinate.toNumberArrays(this._coordinates)
    if (count < 2) return
    if (count === 2) {
      let mid = Mid(_points[0], _points[1])
      let d = MathDistance(_points[0], mid)
      let pnt = getThirdPoint(_points[0], mid, Constants.HALF_PI, d)
      _points.push(pnt)
    }
    let [pnt1, pnt2, pnt3, startAngle, endAngle] = [_points[0], _points[1], _points[2], undefined, undefined]
    let center = getCircleCenterOfThreePoints(pnt1, pnt2, pnt3)
    let radius = MathDistance(pnt1, center)
    let angle1 = getAzimuth(pnt1, center)
    let angle2 = getAzimuth(pnt2, center)
    if (isClockWise(pnt1, pnt2, pnt3)) {
      startAngle = angle2
      endAngle = angle1
    } else {
      startAngle = angle1
      endAngle = angle2
    }
    _points = getArcPoints(center, radius, startAngle, endAngle)
    _points.push(_points[0])
    this.setCoordinates([
      Coordinate.toCoordinates(_points)
    ])
  }

  setPoints (coordinates) {
    this._coordinates = !coordinates ? [] : coordinates
    if (this._coordinates.length >= 1) {
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
    return {
      'feature': this.toGeoJSON(options),
      'subType': 'Lune'
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const attackArrow = new Lune(json['coordinates'], json['width'], json['height'], json['options'])
    attackArrow.setProperties(feature['properties'])
    return attackArrow
  }
}

Lune.registerJSONType('Lune')

export default Lune
