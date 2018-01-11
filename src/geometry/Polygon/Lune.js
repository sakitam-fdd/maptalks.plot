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
  isClockWise,
  getAzimuth,
  getArcPoints,
  getCircleCenterOfThreePoints
} from '../helper/index'
const Coordinate = maptalks.Coordinate
class Lune extends maptalks.Polygon {
  constructor (coordinates, points, options = {}) {
    super(options)
    this.type = 'Lune'
    this._coordinates = []
    this._points = points || []
    if (coordinates) {
      this.setCoordinates(coordinates)
    }
  }

  /**
   * 获取geom类型
   * @returns {string}
   */
  getPlotType () {
    return this.type
  }

  /**
   * handle coordinates
   * @private
   */
  _generate () {
    const count = this._points.length
    let _points = Coordinate.toNumberArrays(this._points)
    if (count < 2) return
    const measurer = this._getMeasurer()
    if (count === 2) {
      let mid = Mid(_points[0], _points[1])
      let pnt = getThirdPoint(
        measurer, _points[0], mid, Constants.HALF_PI,
        measurer.measureLength(Coordinate.toCoordinates(_points[0]), Coordinate.toCoordinates(mid))
      )
      _points.push(pnt)
    }
    let [pnt1, pnt2, pnt3, startAngle, endAngle] = [_points[0], _points[1], _points[2], undefined, undefined]
    let center = getCircleCenterOfThreePoints(pnt1, pnt2, pnt3)
    let radius = measurer.measureLength(Coordinate.toCoordinates(pnt1), Coordinate.toCoordinates(center))
    let angle1 = getAzimuth(pnt1, center)
    let angle2 = getAzimuth(pnt2, center)
    if (isClockWise(pnt1, pnt2, pnt3)) {
      startAngle = angle2
      endAngle = angle1
    } else {
      startAngle = angle1
      endAngle = angle2
    }
    _points = getArcPoints(measurer, center, radius, startAngle, endAngle)
    _points.push(_points[0])
    this.setCoordinates([
      Coordinate.toCoordinates(_points)
    ])
  }

  /**
   * 更新控制点
   * @param coordinates
   */
  setPoints (coordinates) {
    this._points = coordinates || []
    if (this._points.length >= 1) {
      this._generate()
    }
  }

  /**
   * 获取控制点
   * @returns {Array|*}
   */
  getPoints () {
    return this._points
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
      'subType': 'Lune',
      'coordinates': coordinates,
      'points': this.getPoints()
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const _geometry = new Lune(json['coordinates'], json['points'], json['options'])
    _geometry.setProperties(feature['properties'])
    return _geometry
  }
}

Lune.registerJSONType('Lune')

export default Lune
