/**
 * Created by FDD on 2017/12/20.
 * @desc 标绘图形构造类
 */
import * as maptalks from 'maptalks'

import Arc from './Polyline/Arc'
import Curve from './Polyline/Curve'
import Polyline from './Polyline/Polyline'
import FreeLine from './Polyline/FreeLine'

import Circle from './Circle/Circle'
import AttackArrow from './Arrow/AttackArrow'

import CurveFlag from './Flag/CurveFlag'
import RectFlag from './Flag/RectFlag'
import TriangleFlag from './Flag/TriangleFlag'

import Lune from './Polygon/Lune'
import Sector from './Polygon/Sector'
import ClosedCurve from './Polygon/ClosedCurve'
import FreePolygon from './Polygon/FreePolygon'
import RectAngle from './Polygon/RectAngle'
import GatheringPlace from './Polygon/GatheringPlace'

import * as PlotTypes from '../core/PlotTypes'
const Polygon = maptalks.Polygon
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
RegisterModes[PlotTypes.ATTACK_ARROW] = {
  'freehand': false,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function (path) {
    return new AttackArrow(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return new Polygon(geometry.getCoordinates(), {
      'symbol': geometry.getSymbol()
    })
  }
}
RegisterModes[PlotTypes.CLOSED_CURVE] = {
  'freehand': false,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function (path) {
    return new ClosedCurve(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return new Polygon(geometry.getCoordinates(), {
      'symbol': geometry.getSymbol()
    })
  }
}
RegisterModes[PlotTypes.LUNE] = {
  'freehand': false,
  'limitClickCount': 3,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function (path) {
    return new Lune(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return new Polygon(geometry.getCoordinates(), {
      'symbol': geometry.getSymbol()
    })
  }
}
RegisterModes[PlotTypes.SECTOR] = {
  'freehand': false,
  'limitClickCount': 3,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function (path) {
    return new Sector(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return new Polygon(geometry.getCoordinates(), {
      'symbol': geometry.getSymbol()
    })
  }
}
RegisterModes[PlotTypes.POLYGON] = {
  'freehand': false,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function (path) {
    return new Polygon(path)
  },
  'update': function (path, geometry) {
    geometry.setCoordinates(path)
  },
  'generate': function (geometry) {
    return new Polygon(geometry.getCoordinates(), {
      'symbol': geometry.getSymbol()
    })
  }
}
RegisterModes[PlotTypes.RECTANGLE] = {
  'freehand': false,
  'limitClickCount': 2,
  'action': ['click', 'mousemove', 'click'],
  'create': function (path) {
    return new RectAngle(path)
  },
  'update': function (path, geometry) {
    geometry.setCoordinates(path)
  },
  'generate': function (geometry) {
    return new Polygon(geometry.getCoordinates(), {
      'symbol': geometry.getSymbol()
    })
  }
}
RegisterModes[PlotTypes.FREE_POLYGON] = {
  'freehand': true,
  'action': ['mousedown', 'drag', 'mouseup'],
  'create': function (path) {
    return new FreePolygon(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return new Polygon(geometry.getCoordinates(), {
      'symbol': geometry.getSymbol()
    })
  }
}
RegisterModes[PlotTypes.GATHERING_PLACE] = {
  'freehand': false,
  'limitClickCount': 3,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function (path) {
    return new GatheringPlace(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return new Polygon(geometry.getCoordinates(), {
      'symbol': geometry.getSymbol()
    })
  }
}
RegisterModes[PlotTypes.CURVEFLAG] = {
  'freehand': false,
  'limitClickCount': 2,
  'action': ['click', 'mousemove', 'click'],
  'create': function (path) {
    return new CurveFlag(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return new Polygon(geometry.getCoordinates(), {
      'symbol': geometry.getSymbol()
    })
  }
}
RegisterModes[PlotTypes.RECTFLAG] = {
  'freehand': false,
  'limitClickCount': 2,
  'action': ['click', 'mousemove', 'click'],
  'create': function (path) {
    return new RectFlag(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return new Polygon(geometry.getCoordinates(), {
      'symbol': geometry.getSymbol()
    })
  }
}
RegisterModes[PlotTypes.TRIANGLEFLAG] = {
  'freehand': false,
  'limitClickCount': 2,
  'action': ['click', 'mousemove', 'click'],
  'create': function (path) {
    return new TriangleFlag(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return new Polygon(geometry.getCoordinates(), {
      'symbol': geometry.getSymbol()
    })
  }
}
RegisterModes[PlotTypes.CIRCLE] = {
  'freehand': false,
  'limitClickCount': 2,
  'action': ['click', 'mousemove', 'click'],
  'create': function (path) {
    return new Circle(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return new maptalks.Circle(geometry.getCenter(), geometry.getRadius(), {
      symbol: {
        lineColor: '#34495e',
        lineWidth: 2,
        polygonFill: '#1bbc9b',
        polygonOpacity: 0.4
      }
    })
  }
}

export default RegisterModes
