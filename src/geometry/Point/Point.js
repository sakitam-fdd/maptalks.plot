/**
 * Created by FDD on 2017/12/12.
 * @desc 线
 * @Inherits maptalks.LineString
 */

import * as maptalks from 'maptalks'
const Coordinate = maptalks.Coordinate

class PlotPoint extends maptalks.Marker {
  constructor (coordinates, points, options = {}) {
    super(coordinates, options)
    this.type = 'PlotPoint'
    this._coordinates = []
    if (coordinates) {
      this._points = coordinates || []
      this.setCoordinates(coordinates)
    }
  }

  _generate () {
    if (this._points) {
      this.setCoordinates(this._points)
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

  _exportGeoJSONGeometry () {
    const points = this.getCoordinates()
    const coordinates = Coordinate.toNumberArrays(points)
    return {
      'type': 'Point',
      'coordinates': coordinates
    }
  }

  _toJSON (options) {
    const opts = maptalks.Util.extend({}, options)
    const coordinates = this.getCoordinates()
    opts.geometry = false
    const feature = this.toGeoJSON(opts)
    feature['geometry'] = {
      'type': 'Point'
    }
    return {
      'feature': feature,
      'subType': 'PlotPoint',
      'coordinates': coordinates,
      'points': this.getPoints()
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const _geometry = new PlotPoint(json['coordinates'], json['points'], json['options'])
    _geometry.setProperties(feature['properties'])
    return _geometry
  }
}

PlotPoint.registerJSONType('PlotPoint')

export default PlotPoint
