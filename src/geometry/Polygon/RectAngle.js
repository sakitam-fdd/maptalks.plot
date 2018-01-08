/**
 * Created by FDD on 2017/12/26.
 * @desc 规则矩形
 * @Inherits maptalks.Polygon
 */
import * as maptalks from 'maptalks'
const Coordinate = maptalks.Coordinate

class RectAngle extends maptalks.Polygon {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'RectAngle'
    this._coordinates = []
    this._points = [] // 控制点
    if (coordinates) {
      this.setPoints(coordinates)
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
    const start = _points[0]
    const end = _points[_points.length - 1]
    const coordinates = [start, [end[0], start[1]], end, [start[0], end[1]], start]
    this.setCoordinates(Coordinate.toCoordinates(coordinates))
  }

  /**
   * 获取插值后点
   * @returns {Array|*}
   */
  getCoordinates () {
    return this._coordinates
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
      'subType': 'RectAngle',
      'coordinates': coordinates
    }
  }

  /**
   * 获取范围
   * @param extents
   * @private
   */
  static _getExtent (coords) {
    const bbox = [ Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY]
    return coords.reduce(function (prev, coord) {
      return [
        Math.min(coord[0], prev[0]),
        Math.min(coord[1], prev[1]),
        Math.max(coord[0], prev[2]),
        Math.max(coord[1], prev[3])
      ]
    }, bbox)
  }

  static fromJSON (json) {
    const feature = json['feature']
    const reactAngle = new RectAngle(json['coordinates'], json['options'])
    reactAngle.setProperties(feature['properties'])
    return reactAngle
  }
}

RectAngle.registerJSONType('RectAngle')

export default RectAngle
