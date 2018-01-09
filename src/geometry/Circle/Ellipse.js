/**
 * Created by FDD on 2017/12/31.
 * @desc 标绘椭圆算法
 * @Inherits maptalks.Ellipse
 */

import * as maptalks from 'maptalks'

class PlotEllipse extends maptalks.Ellipse {
  constructor (coordinates, width, height, options = {}) {
    super(null, options)
    this.type = 'PlotEllipse'
    if (coordinates) {
      this.setCoordinates(coordinates)
    }
    this.width = width
    this.height = height
  }

  /**
   * 获取geom类型
   * @returns {string}
   */
  getPlotType () {
    return this.type
  }

  _toJSON (options) {
    const opts = maptalks.Util.extend({}, options)
    const center = this.getCenter()
    opts.geometry = false
    const feature = this.toGeoJSON(opts)
    feature['geometry'] = {
      'type': 'Polygon'
    }
    return {
      'feature': feature,
      'subType': 'PlotEllipse',
      'coordinates': [center.x, center.y],
      'width': this.getWidth(),
      'height': this.getHeight()
    }
  }

  static fromJSON (json) {
    const GeoJSON = json['feature']
    const feature = new PlotEllipse(json['coordinates'], json['width'], json['height'], json['options'])
    feature.setProperties(GeoJSON['properties'])
    return feature
  }
}

PlotEllipse.registerJSONType('PlotEllipse')

export default PlotEllipse
