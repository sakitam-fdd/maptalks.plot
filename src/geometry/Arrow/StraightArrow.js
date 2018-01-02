/**
 * Created by FDD on 2017/12/31.
 * @desc 细直箭头
 * @Inherits maptalks.LineString
 */

import * as maptalks from 'maptalks'
import {
  getThirdPoint,
  MathDistance
} from '../helper/index'
const Coordinate = maptalks.Coordinate

const _options = {
  'maxArrowLength': 3000000,
  'arrowLengthScale': 5,
  'arrowStyle': null,
  'arrowPlacement': 'vertex-last', // vertex-first, vertex-last, vertex-firstlast, point
  'clipToPaint': true
}

class StraightArrow extends maptalks.LineString {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'StraightArrow'
    this._coordinates = []
    if (coordinates) {
      this.setPoints(coordinates)
    }
  }

  /**
   * 处理插值
   */
  _generate () {
    try {
      const count = this._coordinates.length
      const _points = Coordinate.toNumberArrays(this._coordinates)
      if (count < 2) return
      let [points1, points2] = [_points[0], _points[1]]
      let distance = MathDistance(points1, points2)
      let len = distance / _options.arrowLengthScale
      len = ((len > _options.maxArrowLength) ? _options.maxArrowLength : len)
      let leftPnt = getThirdPoint(points1, points2, Math.PI / 6, len, false)
      let rightPnt = getThirdPoint(points1, points2, Math.PI / 6, len, true)
      this.setCoordinates(Coordinate.toCoordinates([points1, points2, leftPnt, points2, rightPnt]))
    } catch (e) {
      console.log(e)
    }
  }

  setPoints (coordinates) {
    this._coordinates = !coordinates ? [] : coordinates
    if (this._coordinates.length >= 1) {
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
    return {
      'feature': this.toGeoJSON(options)
    }
  }
}

StraightArrow.registerJSONType('StraightArrow')
StraightArrow.mergeOptions(_options)

export default StraightArrow
