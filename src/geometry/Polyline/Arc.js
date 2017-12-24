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
    let count = this._coordinates.length
    if (count < 2) return
    if (count === 2) {
      this.setCoordinates(this._coordinates)
    } else {
      let [
        pnt1, pnt2,
        pnt3, startAngle,
        endAngle
      ] = [
        this._coordinates[0], this._coordinates[1],
        this._coordinates[2], null, null
      ]
      let center = getCircleCenterOfThreePoints([pnt1['x'], pnt1['y']], [pnt2['x'], pnt2['y']], [pnt3['x'], pnt3['y']])
      let radius = MathDistance([pnt1['x'], pnt1['y']], center)
      let angle1 = getAzimuth([pnt1['x'], pnt1['y']], center)
      let angle2 = getAzimuth([pnt2['x'], pnt2['y']], center)
      if (isClockWise([pnt1['x'], pnt1['y']], [pnt2['x'], pnt2['y']], [pnt3['x'], pnt3['y']])) {
        startAngle = angle2
        endAngle = angle1
      } else {
        startAngle = angle1
        endAngle = angle2
      }
      let points = getArcPoints(center, radius, startAngle, endAngle)
      if (Array.isArray(points)) {
        let _points = points.map(_item => {
          if (Array.isArray(_item)) {
            if (!isNaN(_item[0]) && !isNaN(_item[1])) {
              return new Coordinate(_item[0], _item[1])
            }
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

Arc.mergeOptions(options)

Arc.registerJSONType('Arc')

export default Arc
