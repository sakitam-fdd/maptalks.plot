/**
 * Created by FDD on 2017/12/26.
 * @desc 集结地
 * @Inherits maptalks.Polygon
 */

import * as maptalks from 'maptalks'
import * as Constants from '../../Constants'
import {
  Mid,
  getThirdPoint,
  MathDistance,
  getBisectorNormals,
  getCubicValue
} from '../helper/index'
const Coordinate = maptalks.Coordinate
class GatheringPlace extends maptalks.Polygon {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'GatheringPlace'
    this._offset = 0.4
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
    let count = this._coordinates.length
    let _points = Coordinate.toNumberArrays(this._coordinates)
    if (count < 2) return
    if (count === 2) {
      let mid = Mid(_points[0], _points[1])
      let d = MathDistance(_points[0], mid) / 0.9
      let pnt = getThirdPoint(_points[0], mid, Constants.HALF_PI, d, true)
      _points = [_points[0], pnt, _points[1]]
    }
    let mid = Mid(_points[0], _points[2])
    _points.push(mid, _points[0], _points[1])
    let [normals, pnt1, pnt2, pnt3, pList] = [[], undefined, undefined, undefined, []]
    for (let i = 0; i < _points.length - 2; i++) {
      pnt1 = _points[i]
      pnt2 = _points[i + 1]
      pnt3 = _points[i + 2]
      let normalPoints = getBisectorNormals(this._offset, pnt1, pnt2, pnt3)
      normals = normals.concat(normalPoints)
    }
    count = normals.length
    normals = [normals[count - 1]].concat(normals.slice(0, count - 1))
    for (let i = 0; i < _points.length - 2; i++) {
      pnt1 = _points[i]
      pnt2 = _points[i + 1]
      pList.push(pnt1)
      for (let t = 0; t <= Constants.FITTING_COUNT; t++) {
        let pnt = getCubicValue(t / Constants.FITTING_COUNT, pnt1, normals[i * 2], normals[i * 2 + 1], pnt2)
        pList.push(pnt)
      }
      pList.push(pnt2)
    }
    this.setCoordinates([
      Coordinate.toCoordinates(pList)
    ])
  }

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
      'subType': 'GatheringPlace'
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const attackArrow = new GatheringPlace(json['coordinates'], json['width'], json['height'], json['options'])
    attackArrow.setProperties(feature['properties'])
    return attackArrow
  }
}

GatheringPlace.registerJSONType('GatheringPlace')

export default GatheringPlace
