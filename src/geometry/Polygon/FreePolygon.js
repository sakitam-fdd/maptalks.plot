/**
 * Created by FDD on 2017/12/26.
 * @desc 自由面
 * @Inherits maptalks.Polygon
 */
import * as maptalks from 'maptalks'
const Coordinate = maptalks.Coordinate
class FreePolygon extends maptalks.Polygon {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'FreePolygon'
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
    this.setCoordinates([this._coordinates])
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
      'subType': 'FreePolygon'
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const attackArrow = new FreePolygon(json['coordinates'], json['width'], json['height'], json['options'])
    attackArrow.setProperties(feature['properties'])
    return attackArrow
  }
}

FreePolygon.registerJSONType('FreePolygon')

export default FreePolygon
