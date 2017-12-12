/**
 * Created by FDD on 2017/5/20.
 * @desc 标绘图形构造类
 */

import Curve from './Polyline/Curve'
import Polyline from './Polyline/Polyline'
import FreeLine from './Polyline/FreeLine'
import * as PlotTypes from '../core/PlotTypes'
const RegisterModes = {}
RegisterModes[PlotTypes.CURVE] = {
  'action': 'clickDblclick',
  'create': function (path) {
    return new Curve(path)
  },
  'update': function (path, geometry) {
    geometry.setCoordinates(path)
  },
  'generate': function (geometry) {
    return geometry
  }
}
RegisterModes[PlotTypes.POLYLINE] = {
  'action': 'clickDblclick',
  'create': function (path) {
    return new Polyline(path)
  },
  'update': function (path, geometry) {
    geometry.setCoordinates(path)
  },
  'generate': function (geometry) {
    return geometry
  }
}
RegisterModes[PlotTypes.FREE_LINE] = {
  'action': 'mouseup',
  'create': function (path) {
    return new FreeLine(path)
  },
  'update': function (path, geometry) {
    geometry.setCoordinates(path)
  },
  'generate': function (geometry) {
    return geometry
  }
}

export default RegisterModes
