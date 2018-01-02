import * as maptalks from 'maptalks'
import {
  getArcPoints,
  MathDistance,
  getAzimuth,
  isClockWise,
  getCircleCenterOfThreePoints
} from '../helper/index'
const Coordinate = maptalks.Coordinate
const options = {
  'arrowStyle': null,
  'arrowPlacement': 'vertex-last', // vertex-first, vertex-last, vertex-firstlast, point
  'clipToPaint': true
}

class Arc extends maptalks.LineString {
  constructor (coordinates, options = {}) {
    super(options)
    this.type = 'Arc'
    this._coordinates = []
    if (coordinates) {
      this.setPoints(coordinates)
    }
  }

  _generate () {
    const _points = Coordinate.toNumberArrays(this._coordinates)
    let count = _points.length
    if (count < 2) return
    if (count === 2) {
      this.setCoordinates(this._coordinates)
    } else {
      let [
        pnt1, pnt2,
        pnt3, startAngle,
        endAngle
      ] = [
        _points[0], _points[1],
        _points[2], null, null
      ]
      let center = getCircleCenterOfThreePoints(pnt1, pnt2, pnt3)
      let radius = MathDistance(pnt1, center)
      let angle1 = getAzimuth(pnt1, center)
      let angle2 = getAzimuth(pnt2, center)
      if (isClockWise(pnt1, pnt2, pnt3)) {
        startAngle = angle2
        endAngle = angle1
      } else {
        startAngle = angle1
        endAngle = angle2
      }
      this.setCoordinates(Coordinate.toCoordinates(getArcPoints(center, radius, startAngle, endAngle)))
    }
  }

  setPoints (coordinates) {
    this._coordinates = !coordinates ? [] : coordinates
    if (this._coordinates.length >= 1) {
      this._generate()
    }
  }

  _exportGeoJSONGeometry () {
    const points = this.getCoordinates()
    const coordinates = Coordinate.toNumberArrays(points)
    return {
      'type': 'LineString',
      'subType': 'Arc',
      'coordinates': coordinates
    }
  }

  _toJSON (options) {
    return {
      'feature': this.toGeoJSON(options)
    }
  }
}

Arc.mergeOptions(options)

Arc.registerJSONType('Arc')

export default Arc
