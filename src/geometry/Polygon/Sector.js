/**
 * Created by FDD on 2017/12/26.
 * @desc 扇形
 * @Inherits maptalks.Polygon
 */

import * as maptalks from 'maptalks'
import {
  MathDistance,
  getAzimuth,
  getArcPoints
} from '../helper/index'
const Coordinate = maptalks.Coordinate

class Sector extends maptalks.Polygon {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'Sector'
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
    if (count === 2) {
      this.setCoordinates([this._coordinates])
    } else {
      let [center, pnt2, pnt3] = [_points[0], _points[1], _points[2]]
      let radius = MathDistance(pnt2, center)
      let startAngle = getAzimuth(pnt2, center)
      let endAngle = getAzimuth(pnt3, center)
      let pList = getArcPoints(center, radius, startAngle, endAngle)
      pList.push(center, pList[0])
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
      'subType': 'Sector'
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const attackArrow = new Sector(json['coordinates'], json['width'], json['height'], json['options'])
    attackArrow.setProperties(feature['properties'])
    return attackArrow
  }
}

Sector.registerJSONType('Sector')

export default Sector
