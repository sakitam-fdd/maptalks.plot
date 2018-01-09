/**
 * Created by FDD on 2017/12/26.
 * @desc 直角旗标（使用两个控制点直接创建直角旗标）
 * @Inherits maptalks.Polygon
 */

import * as maptalks from 'maptalks'
const Coordinate = maptalks.Coordinate
class RectFlag extends maptalks.Polygon {
  constructor (coordinates, points, options = {}) {
    super(options)
    this.type = 'RectFlag'
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
    this.setCoordinates([
      Coordinate.toCoordinates(RectFlag.calculatePoints(_points))
    ])
  }

  /**
   * 获取插值后的数据
   * @returns {Array}
   */
  getCoordinates () {
    return this._coordinates
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
    this._points = coordinates || []
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
      'subType': 'RectFlag',
      'coordinates': coordinates,
      'points': this.getPoints()
    }
  }
  /**
   * 插值点数据
   * @param points
   * @returns {Array}
   */
  static calculatePoints (points) {
    let components = []
    // 至少需要两个控制点
    if (points.length > 1) {
      // 取第一个
      let startPoint = points[0]
      // 取最后一个
      let endPoint = points[points.length - 1]
      let point1 = [endPoint[0], startPoint[1]]
      let point2 = [endPoint[0], (startPoint[1] + endPoint[1]) / 2]
      let point3 = [startPoint[0], (startPoint[1] + endPoint[1]) / 2]
      let point4 = [startPoint[0], endPoint[1]]
      components = [startPoint, point1, point2, point3, point4]
    }
    return components
  }

  static fromJSON (json) {
    const feature = json['feature']
    const rectFlag = new RectFlag(json['coordinates'], json['points'], json['options'])
    rectFlag.setProperties(feature['properties'])
    return rectFlag
  }
}

RectFlag.registerJSONType('RectFlag')

export default RectFlag
