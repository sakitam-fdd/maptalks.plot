/**
 * Created by FDD on 2017/12/26.
 * @desc 闭合曲面
 * @Inherits maptalks.Polygon
 */
import * as maptalks from 'maptalks'
import * as Constants from '../../Constants'
import {
  getBisectorNormals,
  getCubicValue
} from '../helper/index'
const Coordinate = maptalks.Coordinate
class ClosedCurve extends maptalks.Polygon {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'ClosedCurve'
    this._offset = 0.3
    this._coordinates = []
    if (coordinates) {
      this.setPoints(coordinates)
    }
  }

  /**
   * 处理插值
   * @returns {*}
   * @private
   */
  _generate () {
    const count = this._coordinates.length
    if (count < 2) return
    if (count === 2) {
      this.setCoordinates([this._coordinates])
    } else {
      const points = Coordinate.toNumberArrays(this._coordinates)
      points.push(points[0], points[1])
      let [normals, pList] = [[], []]
      for (let i = 0; i < points.length - 2; i++) {
        let normalPoints = getBisectorNormals(this._offset, points[i], points[i + 1], points[i + 2])
        normals = normals.concat(normalPoints)
      }
      let count = normals.length
      normals = [normals[count - 1]].concat(normals.slice(0, count - 1))
      for (let i = 0; i < points.length - 2; i++) {
        let pnt1 = points[i]
        let pnt2 = points[i + 1]
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
      'subType': 'ClosedCurve'
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const attackArrow = new ClosedCurve(json['coordinates'], json['width'], json['height'], json['options'])
    attackArrow.setProperties(feature['properties'])
    return attackArrow
  }
}

ClosedCurve.registerJSONType('ClosedCurve')

export default ClosedCurve
