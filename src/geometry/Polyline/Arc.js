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
  constructor (coordinates, points, options = {}) {
    super(options)
    this.type = 'Arc'
    this._coordinates = []
    this._points = points || []
    if (coordinates) {
      this.setCoordinates(coordinates)
    }
  }

  /**
   * 获取geom类型
   * @returns {string}
   */
  getPlotType () {
    return this.type
  }

  _generate () {
    const _points = Coordinate.toNumberArrays(this._points)
    let count = _points.length
    if (count < 2) return
    if (count === 2) {
      this.setCoordinates(this._points)
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

  /**
   * 获取控制点
   * @returns {Array|*}
   */
  getPoints () {
    return this._points
  }

  /**
   * set point
   * @param coordinates
   */
  setPoints (coordinates) {
    this._points = !coordinates ? [] : coordinates
    if (this._points.length >= 1) {
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
    const opts = maptalks.Util.extend({}, options)
    const coordinates = this.getCoordinates()
    opts.geometry = false
    const feature = this.toGeoJSON(opts)
    feature['geometry'] = {
      'type': 'LineString'
    }
    return {
      'feature': feature,
      'subType': 'Arc',
      'coordinates': coordinates,
      'points': this.getPoints()
    }
  }

  static fromJSON (json) {
    const feature = json['feature']
    const _arc = new Arc(json['coordinates'], json['points'], json['options'])
    _arc.setProperties(feature['properties'])
    return _arc
  }
}

Arc.mergeOptions(options)

Arc.registerJSONType('Arc')

export default Arc
