/**
 * Created by FDD on 2017/12/12.
 * @desc 线
 * @Inherits maptalks.LineString
 */

import * as maptalks from 'maptalks'
import Curve from "./Curve";
import {getCurvePoints} from "../helper";
const Coordinate = maptalks.Coordinate
const options = {
  'arrowStyle': null,
  'arrowPlacement': 'vertex-last', // vertex-first, vertex-last, vertex-firstlast, point
  'clipToPaint': true
}

class Polyline extends maptalks.LineString {
  constructor (coordinates, points, options = {}) {
    super(options)
    this.type = 'Polyline'
    this._coordinates = []
    this._points = points || []
    if (coordinates) {
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
      'type': 'LineString',
      'coordinates': coordinates
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
      'subType': 'Polyline',
      'coordinates': coordinates,
      'points': this.getPoints()
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const _geometry = new Polyline(json['coordinates'], json['points'], json['options'])
    _geometry.setProperties(feature['properties'])
    return _geometry
  }
}

Polyline.mergeOptions(options)

Polyline.registerJSONType('Polyline')

export default Polyline
