/**
 * Created by FDD on 2017/12/26.
 * @desc 规则矩形
 * @Inherits maptalks.Polygon
 */
import * as maptalks from 'maptalks'
const Coordinate = maptalks.Coordinate

maptalks.Polygon.getCoordinateFromExtent = function (extent) {
  let [minX, minY, maxX, maxY] = [extent[0], extent[1], extent[2], extent[3]]
  return [minX, minY, minX, maxY, maxX, maxY, maxX, minY, minX, minY]
}

const boundingExtent = function (coordinates) {
  let extent = new maptalks.Extent()
  for (let i = 0, ii = coordinates.length; i < ii; ++i) {
    extent.add(extent, coordinates[i])
  }
  return extent
}

class RectAngle extends maptalks.Polygon {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'RectAngle'
    this._coordinates = []
    this.isFill = ((options['isFill'] === false) ? options['isFill'] : true)
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
      let coordinates = []
      if (this.isFill) {
        let extent = boundingExtent(this._coordinates)
        coordinates = maptalks.Polygon.getCoordinateFromExtent(extent)
      } else {
        let start = _points[0]
        let end = _points[1]
        coordinates = [start, [start[0], end[1]], end, [end[0], start[1]], start]
      }
      this.setCoordinates([
        Coordinate.toCoordinates(coordinates)
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
      'subType': 'RectAngle'
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const attackArrow = new RectAngle(json['coordinates'], json['width'], json['height'], json['options'])
    attackArrow.setProperties(feature['properties'])
    return attackArrow
  }
}

RectAngle.registerJSONType('RectAngle')

export default RectAngle
