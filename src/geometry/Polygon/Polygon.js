/**
 * Created by FDD on 2018/01/03.
 * @desc 面
 * @Inherits maptalks.Polygon
 */
import * as maptalks from 'maptalks'
const Coordinate = maptalks.Coordinate

class PlotPolygon extends maptalks.Polygon {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'PlotPolygon'
    this._coordinates = []
    this._points = []
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
    this.setCoordinates(this._points)
  }

  /**
   * 获取插值后的数据
   * @returns {Array}
   */
  getCoordinates () {
    return this._coordinates
  }

  /**
   * 更新控制点
   * @param coordinates
   */
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
      'subType': 'PlotPolygon',
      'coordinates': coordinates
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const feature_ = new PlotPolygon(json['coordinates'], json['options'])
    feature_.setProperties(feature['properties'])
    return feature_
  }
}

PlotPolygon.registerJSONType('PlotPolygon')

export default PlotPolygon
