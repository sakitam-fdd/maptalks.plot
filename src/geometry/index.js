/**
 * Created by FDD on 2017/5/20.
 * @desc 标绘图形构造类
 */

import Arc from './Polyline/Arc'
import Curve from './Polyline/Curve'
import Polyline from './Polyline/Polyline'
import FreeLine from './Polyline/FreeLine'
import * as PlotTypes from '../core/PlotTypes'
const RegisterModes = {}
RegisterModes[PlotTypes.ARC] = {
  'freehand': false,
  'limitClickCount': 3,
  'action': ['click', 'mousemove'],
  'create': function (path) {
    return new Arc(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return geometry
  }
}
RegisterModes[PlotTypes.CURVE] = {
  'freehand': false,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function (path) {
    return new Curve(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return geometry
  }
}
RegisterModes[PlotTypes.POLYLINE] = {
  'freehand': false,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function (path) {
    return new Polyline(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return geometry
  }
}
RegisterModes[PlotTypes.FREE_LINE] = {
  'freehand': true,
  'action': ['mousedown', 'drag', 'mouseup'],
  'create': function (path) {
    return new FreeLine(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return geometry
  }
}

export default RegisterModes
