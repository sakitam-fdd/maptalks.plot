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
    if (count === 2) {
      let start = _points[0]
      let end = _points[1]
      let coordinates = [start, [start[0], end[1]], end, [end[0], start[1]], start]
      this.setCoordinates(Coordinate.toCoordinates(coordinates))
    }
  }

  getCoordinates () {
    return this._coordinates
  }

  setPoints (coordinates) {
    this._points = !coordinates ? [] : coordinates
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

  static fromJSON (json) {
    const feature = json['feature']
    const reactAngle = new RectAngle(json['coordinates'], json['options'])
    reactAngle.setProperties(feature['properties'])
    return reactAngle
  }
}

RectAngle.registerJSONType('RectAngle')

export default RectAngle
