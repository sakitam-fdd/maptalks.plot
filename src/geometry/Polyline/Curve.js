/**
 * Created by FDD on 2017/12/10.
 * @desc 标绘曲线算法
 */

import * as maptalks from 'maptalks'
import { getCurvePoints } from '../helper/index'
const Coordinate = maptalks.Coordinate
const options = {
  'arrowStyle': null,
  'arrowPlacement': 'vertex-last', // vertex-first, vertex-last, vertex-firstlast, point
  'clipToPaint': true
}
class Curve extends maptalks.LineString {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'Curve'
    this._coordinates = []
    if (coordinates) {
      this.setPoints(coordinates)
    }
  }

  _generate () {
    const _points = Coordinate.toNumberArrays(this._coordinates)
    let count = _points.length
    if (count < 2) {
      return false
    } else if (count === 2) {
      this.setCoordinates(this._coordinates)
    } else {
      let points = getCurvePoints(0.3, _points)
      this.setCoordinates(Coordinate.toCoordinates(points))
    }
  }

  setPoints (coordinates) {
    this._coordinates = !coordinates ? [] : coordinates
    if (this._coordinates.length >= 1) {
      this._generate()
    }
  }

  _toJSON (options) {
    return {
      'feature': this.toGeoJSON(options),
      'subType': 'Curve'
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const arc = new Curve(feature['geometry']['coordinates'], json['options'])
    arc.setProperties(feature['properties'])
    return arc
  }
}
Curve.registerJSONType('Curve')
Curve.mergeOptions(options)

export default Curve
