import * as maptalks from 'maptalks'
const Coordinate = maptalks.Coordinate
const options = {
  'arrowStyle': null,
  'arrowPlacement': 'vertex-last', // vertex-first, vertex-last, vertex-firstlast, point
  'clipToPaint': true
}

class Polyline extends maptalks.LineString {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'Polyline'
    if (coordinates) {
      this.setCoordinates(coordinates)
    }
  }

  setPoints (coordinates) {
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

Polyline.mergeOptions(options)

Polyline.registerJSONType('Polyline')

export default Polyline
