/**
 * Created by FDD on 2017/12/12.
 * @desc 自由线
 * @Inherits maptalks.LineString
 */
import * as maptalks from 'maptalks'
const Coordinate = maptalks.Coordinate
const options = {
  'arrowStyle': null,
  'arrowPlacement': 'vertex-last', // vertex-first, vertex-last, vertex-firstlast, point
  'clipToPaint': true
}

class FreeLine extends maptalks.LineString {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'FreeLine'
    if (coordinates) {
      this.setCoordinates(coordinates)
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

FreeLine.mergeOptions(options)

FreeLine.registerJSONType('FreeLine')

export default FreeLine
