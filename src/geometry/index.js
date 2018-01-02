/**
 * Created by FDD on 2017/12/20.
 * @desc 标绘图形构造类
 */
import * as maptalks from 'maptalks'

import Arc from './Polyline/Arc'
import Curve from './Polyline/Curve'
import Polyline from './Polyline/Polyline'
import FreeLine from './Polyline/FreeLine'

import PlotCircle from './Circle/Circle'
import PlotEllipse from './Circle/Ellipse'
import AttackArrow from './Arrow/AttackArrow'
import DoubleArrow from './Arrow/DoubleArrow'
import FineArrow from './Arrow/FineArrow'
import StraightArrow from './Arrow/StraightArrow'
import AssaultDirection from './Arrow/AssaultDirection'
import SquadCombat from './Arrow/SquadCombat'
import TailedAttackArrow from './Arrow/TailedAttackArrow'
import TailedSquadCombat from './Arrow/TailedSquadCombat'

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
const Coordinate = maptalks.Coordinate
const RegisterModes = {}
RegisterModes[PlotTypes.POINT] = {
  'freehand': false,
  'limitClickCount': 1,
  'action': ['click'],
  'create': function (path) {
    return new maptalks.Marker(path[0])
  },
  'update': function (path, geometry) {
  },
  'generate': function (geometry) {
    return geometry
  }
}
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
    return geometry
  }
}
RegisterModes[PlotTypes.DOUBLE_ARROW] = {
  'freehand': false,
  'limitClickCount': 4,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function (path) {
    return new DoubleArrow(path)
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
RegisterModes[PlotTypes.FINE_ARROW] = {
  'freehand': false,
  'limitClickCount': 2,
  'action': ['click', 'mousemove', 'click'],
  'create': function (path) {
    return new FineArrow(path)
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
RegisterModes[PlotTypes.ASSAULT_DIRECTION] = {
  'freehand': false,
  'limitClickCount': 2,
  'action': ['click', 'mousemove', 'click'],
  'create': function (path) {
    return new AssaultDirection(path)
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
RegisterModes[PlotTypes.SQUAD_COMBAT] = {
  'freehand': false,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function (path) {
    return new SquadCombat(path)
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
RegisterModes[PlotTypes.TAILED_ATTACK_ARROW] = {
  'freehand': false,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function (path) {
    return new TailedAttackArrow(path)
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
RegisterModes[PlotTypes.TAILED_SQUAD_COMBAT] = {
  'freehand': false,
  'limitClickCount': 2,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function (path) {
    return new TailedSquadCombat(path)
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
RegisterModes[PlotTypes.STRAIGHT_ARROW] = {
  'freehand': false,
  'limitClickCount': 2,
  'action': ['click', 'mousemove', 'click'],
  'create': function (path) {
    return new StraightArrow(path)
  },
  'update': function (path, geometry) {
    geometry.setPoints(path)
  },
  'generate': function (geometry) {
    return geometry
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
    geometry.setPoints(path)
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
  'freehand': true,
  'action': ['mousedown', 'drag', 'mouseup'],
  'create': function (coordinate) {
    return new PlotCircle(coordinate[0], 0)
  },
  'update': function (path, geometry) {
    const map = geometry.getMap()
    const radius = map.computeLength(geometry.getCenter(), path[path.length - 1])
    geometry.setRadius(radius)
  },
  'generate': function (geometry) {
    return geometry
  }
}
RegisterModes[PlotTypes.ELLIPSE] = {
  'freehand': true,
  'action': ['mousedown', 'drag', 'mouseup'],
  'create': function (coordinate) {
    return new PlotEllipse(coordinate[0], 0, 0)
  },
  'update': function (path, geometry) {
    const map = geometry.getMap()
    const center = geometry.getCenter()
    const rx = map.computeLength(center, new Coordinate({
      x: path[path.length - 1].x,
      y: center.y
    }))
    const ry = map.computeLength(center, new Coordinate({
      x: center.x,
      y: path[path.length - 1].y
    }))
    geometry.setWidth(rx * 2)
    geometry.setHeight(ry * 2)
  },
  'generate': function (geometry) {
    return geometry
  }
}

export default RegisterModes
