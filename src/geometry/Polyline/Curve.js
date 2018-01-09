/**
 * Created by FDD on 2017/12/10.
 * @desc 标绘曲线算法
 */

import * as maptalks from 'maptalks'
import { getCurvePoints } from '../helper/index'
const Coordinate = maptalks.Coordinate
const options = {
  'arrowStyle': null,
  'arrowPlacement': 'vertex-last', // vertex-first, vertex-last, vertex-firstlast, point
  'clipToPaint': true
}
class Curve extends maptalks.LineString {
  constructor (coordinates, points, options = {}) {
    super(options)
    this.type = 'Curve'
    this._coordinates = []
    this._points = points || []
    if (coordinates) {
      this.setCoordinates(coordinates)
    }
  }

  _generate () {
    const _points = Coordinate.toNumberArrays(this._points)
    let count = _points.length
    if (count < 2) {
      return false
    } else if (count === 2) {
      this.setCoordinates(this._points)
    } else {
      let points = getCurvePoints(0.3, _points)
      this.setCoordinates(Coordinate.toCoordinates(points))
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

  _toJSON (options) {
    const opts = maptalks.Util.extend({}, options)
    const coordinates = this.getCoordinates()
    opts.geometry = false
    const feature = this.toGeoJSON(opts)
    feature['geometry'] = {
      'type': 'LineString'
    }
    return {
      'feature': feature,
      'subType': 'Curve',
      'coordinates': coordinates,
      'points': this.getPoints()
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const _geometry = new Curve(json['coordinates'], json['points'], json['options'])
    _geometry.setProperties(feature['properties'])
    return _geometry
  }
}
Curve.registerJSONType('Curve')
Curve.mergeOptions(options)

export default Curve
