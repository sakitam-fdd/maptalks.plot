/**
 * Created by FDD on 2017/12/26.
 * @desc 规则矩形
 * @Inherits maptalks.Polygon
 */
import * as maptalks from 'maptalks'
const Coordinate = maptalks.Coordinate

class RectAngle extends maptalks.Polygon {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'RectAngle'
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
      let start = _points[0]
      let end = _points[1]
      let coordinates = [start, [start[0], end[1]], end, [end[0], start[1]], start]
      this.setCoordinates(Coordinate.toCoordinates(coordinates))
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
      'subType': 'RectAngle'
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const reactAngle = new RectAngle(json['coordinates'], json['options'])
    reactAngle.setProperties(feature['properties'])
    return reactAngle
  }
}

RectAngle.registerJSONType('RectAngle')

export default RectAngle
