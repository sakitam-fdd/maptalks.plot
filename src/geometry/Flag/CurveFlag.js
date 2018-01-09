/**
 * Created by FDD on 2017/12/26.
 * @desc 曲线旗标
 * @Inherits maptalks.Polygon
 */

import * as maptalks from 'maptalks'
import {
  getBezierPoints
} from '../helper/index'
const Coordinate = maptalks.Coordinate
class CurveFlag extends maptalks.Polygon {
  constructor (coordinates, points, options = {}) {
    super(options)
    this.type = 'CurveFlag'
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
      Coordinate.toCoordinates(CurveFlag.calculatePoints(_points))
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
      'subType': 'CurveFlag',
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
      // 上曲线起始点
      let point1 = startPoint
      // 上曲线第一控制点
      let point2 = [(endPoint[0] - startPoint[0]) / 4 + startPoint[0], (endPoint[1] - startPoint[1]) / 8 + startPoint[1]]
      // 上曲线第二个点
      let point3 = [(startPoint[0] + endPoint[0]) / 2, startPoint[1]]
      // 上曲线第二控制点
      let point4 = [(endPoint[0] - startPoint[0]) * 3 / 4 + startPoint[0], -(endPoint[1] - startPoint[1]) / 8 + startPoint[1]]
      // 上曲线结束点
      let point5 = [endPoint[0], startPoint[1]]
      // 下曲线结束点
      let point6 = [endPoint[0], (startPoint[1] + endPoint[1]) / 2]
      // 下曲线第二控制点
      let point7 = [(endPoint[0] - startPoint[0]) * 3 / 4 + startPoint[0], (endPoint[1] - startPoint[1]) * 3 / 8 + startPoint[1]]
      // 下曲线第二个点
      let point8 = [(startPoint[0] + endPoint[0]) / 2, (startPoint[1] + endPoint[1]) / 2]
      // 下曲线第一控制点
      let point9 = [(endPoint[0] - startPoint[0]) / 4 + startPoint[0], (endPoint[1] - startPoint[1]) * 5 / 8 + startPoint[1]]
      // 下曲线起始点
      let point10 = [startPoint[0], (startPoint[1] + endPoint[1]) / 2]
      // 旗杆底部点
      let point11 = [startPoint[0], endPoint[1]]
      // 计算上曲线
      let curve1 = getBezierPoints([point1, point2, point3, point4, point5])
      // 计算下曲线
      let curve2 = getBezierPoints([point6, point7, point8, point9, point10])
      // 合并
      components = curve1.concat(curve2)
      components.push(point11)
    }
    return components
  }

  static fromJSON (json) {
    const feature = json['feature']
    const curveFlag = new CurveFlag(json['coordinates'], json['points'], json['options'])
    curveFlag.setProperties(feature['properties'])
    return curveFlag
  }
}

CurveFlag.registerJSONType('CurveFlag')

export default CurveFlag
