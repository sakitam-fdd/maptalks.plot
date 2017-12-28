/**
 * Created by FDD on 2017/12/28.
 * @desc 标绘画圆算法
 * @Inherits maptalks.Polygon
 */

import * as maptalks from 'maptalks'
import { MathDistance } from '../helper'
const Coordinate = maptalks.Coordinate
class Circle extends maptalks.Circle {
  constructor (coordinates, radius, options = {}) {
    super(null, options)
    this.type = 'Circle'
    this._coordinates = []
    if (coordinates) {
      this.setPoints(coordinates)
    }
    this.options = options
    this._radius = radius
    this._center = coordinates
  }

  /**
   * handle coordinates
   * @private
   */
  _generate () {
    const count = this._coordinates.length
    let _points = Coordinate.toNumberArrays(this._coordinates)
    if (count < 2) return
    this._center = _points[0]
    this._radius = MathDistance(this._center, _points[1])
    this.setRadius(this._radius)
    // this.setCoordinates(Coordinate.toCoordinates(_points))
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

  getCenter () {
    return Coordinate.toCoordinates(this._center)
  }

  _exportGeoJSONGeometry () {
    const coordinates = Coordinate.toNumberArrays([this.getShell()])
    return {
      'type': 'Polygon',
      'coordinates': coordinates
    }
  }

  _toJSON (options) {
    const center = this.getCenter()
    const opts = maptalks.Util.extend({}, options)
    opts.geometry = false
    const feature = this.toGeoJSON(opts)
    feature['geometry'] = {
      'type': 'Polygon'
    }
    return {
      'feature': feature,
      'subType': 'Circle',
      'coordinates': [center.x, center.y],
      'radius': this.getRadius()
    }
  }

  static fromJSON (json) {
    const GeoJSON = json['feature']
    const feature = new Circle(json['coordinates'], json['radius'], json['options'])
    feature.setProperties(GeoJSON['properties'])
    return feature
  }
}

Circle.registerJSONType('Circle')

export default Circle
