/**
 * Created by FDD on 2017/12/26.
 * @desc 直角旗标（使用两个控制点直接创建直角旗标）
 * @Inherits maptalks.Polygon
 */

import * as maptalks from 'maptalks'
const Coordinate = maptalks.Coordinate
class RectFlag extends maptalks.Polygon {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'RectFlag'
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
    this.setCoordinates([
      Coordinate.toCoordinates(RectFlag.calculatePoints(_points))
    ])
  }

  /**
   * set point
   * @param coordinates
   */
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
      'subType': 'RectFlag'
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
    const rectFlag = new RectFlag(json['coordinates'], json['width'], json['height'], json['options'])
    rectFlag.setProperties(feature['properties'])
    return rectFlag
  }
}

RectFlag.registerJSONType('RectFlag')

export default RectFlag
