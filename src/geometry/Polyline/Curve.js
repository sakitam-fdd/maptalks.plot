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
    let count = this._coordinates.length
    if (count < 2) {
      return false
    } else if (count === 2) {
      this.setCoordinates(this._coordinates)
    } else {
      let _coordinates = this._coordinates.map(_item => {
        if (_item && _item.hasOwnProperty('x')) {
          return [_item['x'], _item['y']]
        } else if (Array.isArray(_item)) {
          return _item
        }
      })
      let points = getCurvePoints(0.3, _coordinates)
      if (Array.isArray(points)) {
        let _points = points.map(_item => {
          if (Array.isArray(_item)) {
            return new Coordinate(_item[0], _item[1])
          } else {
            return _item
          }
        })
        this.setCoordinates(_points)
      }
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
