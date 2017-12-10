/**
 * Created by FDD on 2017/12/10.
 * @desc 标绘曲线算法
 */

import * as maptalks from 'maptalks'
const Canvas2d = maptalks.Canvas
const options = {
  'arcDegree': 90
}
class Curve extends maptalks.LineString {
  _arc (ctx, points, lineOpacity) {
    const degree = this.options['arcDegree'] * Math.PI / 180
    for (let i = 1, l = points.length; i < l; i++) {
      Canvas2d._arcBetween(ctx, points[i - 1], points[i], degree)
      Canvas2d._stroke(ctx, lineOpacity)
    }
  }

  _quadraticCurve (ctx, points) {
    if (points.length <= 2) {
      Canvas2d._path(ctx, points)
      return
    }
    Canvas2d.quadraticCurve(ctx, points)
  }

  _bezierCurve (ctx, points) {
    if (points.length <= 3) {
      Canvas2d._path(ctx, points)
      return
    }
    let i, l
    for (i = 1, l = points.length; i + 2 < l; i += 3) {
      ctx.bezierCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, points[i + 2].x, points[i + 2].y)
    }
    if (i < l) {
      for (; i < l; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
    }
  }

  _toJSON (options) {
    return {
      'feature': this.toGeoJSON(options),
      'subType': 'Curve'
    }
  }

  // paint method on canvas
  _paintOn (ctx, points, lineOpacity) {
    ctx.beginPath()
    this._arc(ctx, points, lineOpacity)
    Canvas2d._stroke(ctx, lineOpacity)
    this._paintArrow(ctx, points, lineOpacity)
  }

  static fromJSON (json) {
    const feature = json['feature']
    const arc = new Curve(feature['geometry']['coordinates'], json['options'])
    arc.setProperties(feature['properties'])
    return arc
  }
}
Curve.registerJSONType('Curve')
Curve.mergeOptions(options)

export default Curve
