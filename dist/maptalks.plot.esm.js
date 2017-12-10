/*!
 * maptalks.plot v0.0.0
 * LICENSE : MIT
 * (c) 2017-2017 https://sakitam-fdd.github.io/maptalks.plot
 */
import { Canvas, DomUtil, Feature, LineString, Map, interaction } from 'maptalks';

var TextArea = 'TextArea';
var ARC = 'Arc';
var CURVE = 'Curve';
var GATHERING_PLACE = 'GatheringPlace';
var POLYLINE = 'Polyline';
var FREE_LINE = 'FreeLine';
var POINT = 'Point';
var PENNANT = 'Pennant';
var RECTANGLE = 'RectAngle';
var CIRCLE = 'Circle';
var ELLIPSE = 'Ellipse';
var LUNE = 'Lune';
var SECTOR = 'Sector';
var CLOSED_CURVE = 'ClosedCurve';
var POLYGON = 'Polygon';
var FREE_POLYGON = 'FreePolygon';
var ATTACK_ARROW = 'AttackArrow';
var DOUBLE_ARROW = 'DoubleArrow';
var STRAIGHT_ARROW = 'StraightArrow';
var FINE_ARROW = 'FineArrow';
var ASSAULT_DIRECTION = 'AssaultDirection';
var TAILED_ATTACK_ARROW = 'TailedAttackArrow';
var SQUAD_COMBAT = 'SquadCombat';
var TAILED_SQUAD_COMBAT = 'TailedSquadCombat';
var RECTFLAG = 'RectFlag';
var TRIANGLEFLAG = 'TriangleFlag';
var CURVEFLAG = 'CurveFlag';


var PlotTypes = Object.freeze({
	TextArea: TextArea,
	ARC: ARC,
	CURVE: CURVE,
	GATHERING_PLACE: GATHERING_PLACE,
	POLYLINE: POLYLINE,
	FREE_LINE: FREE_LINE,
	POINT: POINT,
	PENNANT: PENNANT,
	RECTANGLE: RECTANGLE,
	CIRCLE: CIRCLE,
	ELLIPSE: ELLIPSE,
	LUNE: LUNE,
	SECTOR: SECTOR,
	CLOSED_CURVE: CLOSED_CURVE,
	POLYGON: POLYGON,
	FREE_POLYGON: FREE_POLYGON,
	ATTACK_ARROW: ATTACK_ARROW,
	DOUBLE_ARROW: DOUBLE_ARROW,
	STRAIGHT_ARROW: STRAIGHT_ARROW,
	FINE_ARROW: FINE_ARROW,
	ASSAULT_DIRECTION: ASSAULT_DIRECTION,
	TAILED_SQUAD_COMBAT: TAILED_SQUAD_COMBAT,
	TAILED_ATTACK_ARROW: TAILED_ATTACK_ARROW,
	SQUAD_COMBAT: SQUAD_COMBAT,
	RECTFLAG: RECTFLAG,
	TRIANGLEFLAG: TRIANGLEFLAG,
	CURVEFLAG: CURVEFLAG
});

var BASE_LAYERNAME = 'ol-plot-vector-layer';

var MathDistance = function MathDistance(pnt1, pnt2) {
  return Math.sqrt(Math.pow(pnt1[0] - pnt2[0], 2) + Math.pow(pnt1[1] - pnt2[1], 2));
};

var EventType = {
  CHANGE: 'change',
  CLICK: 'click',
  DBLCLICK: 'dblclick',
  DRAGENTER: 'dragenter',
  DRAGOVER: 'dragover',
  DROP: 'drop',
  ERROR: 'error',
  KEYDOWN: 'keydown',
  KEYPRESS: 'keypress',
  LOAD: 'load',
  MOUSEDOWN: 'mousedown',
  MOUSEMOVE: 'mousemove',
  MOUSEOUT: 'mouseout',
  MOUSEUP: 'mouseup',
  MOUSEWHEEL: 'mousewheel',
  MSPOINTERDOWN: 'MSPointerDown',
  RESIZE: 'resize',
  TOUCHSTART: 'touchstart',
  TOUCHMOVE: 'touchmove',
  TOUCHEND: 'touchend',
  WHEEL: 'wheel'
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};











var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Canvas2d = Canvas;

var Curve = function (_maptalks$LineString) {
  inherits(Curve, _maptalks$LineString);

  function Curve() {
    classCallCheck(this, Curve);
    return possibleConstructorReturn(this, _maptalks$LineString.apply(this, arguments));
  }

  Curve.prototype._arc = function _arc(ctx, points, lineOpacity) {
    var degree = this.options['arcDegree'] * Math.PI / 180;
    for (var i = 1, l = points.length; i < l; i++) {
      Canvas2d._arcBetween(ctx, points[i - 1], points[i], degree);
      Canvas2d._stroke(ctx, lineOpacity);
    }
  };

  Curve.prototype._quadraticCurve = function _quadraticCurve(ctx, points) {
    if (points.length <= 2) {
      Canvas2d._path(ctx, points);
      return;
    }
    Canvas2d.quadraticCurve(ctx, points);
  };

  Curve.prototype._bezierCurve = function _bezierCurve(ctx, points) {
    if (points.length <= 3) {
      Canvas2d._path(ctx, points);
      return;
    }
    var i = void 0,
        l = void 0;
    for (i = 1, l = points.length; i + 2 < l; i += 3) {
      ctx.bezierCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, points[i + 2].x, points[i + 2].y);
    }
    if (i < l) {
      for (; i < l; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
  };

  return Curve;
}(LineString);

var createPlot = function createPlot(type, points, _params) {
  var params = _params || {};
  switch (type) {
    case CURVE:
      return new Curve(points, params, '');
  }
  return null;
};

var PlotDraw = function () {
  function PlotDraw(map) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, PlotDraw);

    if (map && map instanceof Map) {
      this.map = map;
    } else {
      throw new Error('传入的不是地图对象！');
    }
    this.options = params || {};

    this.points = null;

    this.plot = null;

    this.feature = null;

    this.plotType = null;

    this.plotParams = null;

    this.mapViewport = this.map.getViewport();

    this.dblClickZoomInteraction = null;

    this.drawOverlay = null;

    this.textInter = null;

    this.layerName = this.options && this.options['layerName'] ? this.options['layerName'] : BASE_LAYERNAME;

    this.drawLayer = this.createVectorLayer(this.layerName, {
      create: true
    });

    this.textAreas = [];
    this.addWindowEventListener();
  }

  PlotDraw.prototype.active = function active(type) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.disActive();
    this.deactiveMapTools();
    this.plotType = type;
    this.plotParams = params;
    this.map.on('click', this.mapFirstClickHandler, this);
  };

  PlotDraw.prototype.addWindowEventListener = function addWindowEventListener() {
    var _this = this;

    document.querySelector('.ol-overlaycontainer').addEventListener('click', function (event) {
      var ev = event || window.event;
      var target = ev.target || ev.srcElement;
      if (target.nodeName.toLowerCase() === 'div') {
        if (_this.textAreas && _this.textAreas.length > 0) {
          _this.textAreas.every(function (item) {
            if (item['uuid'] === target.id) {
              _this.dispatch('active_textArea', item);
            }
          });
        }
      }
    });
  };

  PlotDraw.prototype.disActive = function disActive() {
    this.removeEventHandlers();
    this.map.removeOverlay(this.drawOverlay);
    if (this.textInter) {
      this.textInter.disActiveInteraction();
    }
    this.points = [];
    this.plot = null;
    this.feature = null;
    this.plotType = null;
    this.plotParams = null;
    this.activateMapTools();
  };

  PlotDraw.prototype.isDrawing = function isDrawing() {
    return !!this.plotType;
  };

  PlotDraw.prototype.mapFirstClickHandler = function mapFirstClickHandler(event) {
    this.map.un('click', this.mapFirstClickHandler, this);
    this.points.push(event.coordinate);
    this.plot = createPlot(this.plotType, this.points, this.plotParams);
    this.plot.setMap(this.map);
    this.feature = new Feature(this.plot);
    this.feature.set('isPlot', true);
    this.drawLayer.getSource().addFeature(this.feature);
    if (this.plotType === POINT || this.plotType === PENNANT) {
      this.plot.finishDrawing();
      this.drawEnd(event);
    } else {
      this.map.on('click', this.mapNextClickHandler, this);
      if (!this.plot.freehand) {
        this.map.on('dblclick', this.mapDoubleClickHandler, this);
      }
      DomUtil.listensDomEvent(this.mapViewport, EventType.MOUSEMOVE, this.mapMouseMoveHandler, this, false);
    }
    if (this.plotType && this.feature) {
      this.plotParams['plotType'] = this.plotType;
      this.feature.setProperties(this.plotParams);
    }
  };

  PlotDraw.prototype.mapNextClickHandler = function mapNextClickHandler(event) {
    if (!this.plot.freehand) {
      if (MathDistance(event.coordinate, this.points[this.points.length - 1]) < 0.0001) {
        return false;
      }
    }
    this.points.push(event.coordinate);
    this.plot.setPoints(this.points);
    if (this.plot.fixPointCount === this.plot.getPointCount()) {
      this.mapDoubleClickHandler(event);
    }
    if (this.plot && this.plot.freehand) {
      this.mapDoubleClickHandler(event);
    }
  };

  PlotDraw.prototype.mapDoubleClickHandler = function mapDoubleClickHandler(event) {
    event.preventDefault();
    this.plot.finishDrawing();
    this.drawEnd(event);
  };

  PlotDraw.prototype.mapMouseMoveHandler = function mapMouseMoveHandler(event) {
    var coordinate = this.map.getCoordinateFromPixel([event.offsetX, event.offsetY]);
    if (MathDistance(coordinate, this.points[this.points.length - 1]) < 0.0001) {
      return false;
    }
    if (!this.plot.freehand) {
      var pnts = this.points.concat([coordinate]);
      this.plot.setPoints(pnts);
    } else {
      this.points.push(coordinate);
      this.plot.setPoints(this.points);
    }
  };

  PlotDraw.prototype.removeEventHandlers = function removeEventHandlers() {
    this.map.un('click', this.mapFirstClickHandler, this);
    this.map.un('click', this.mapNextClickHandler, this);
    DomUtil.removeDomEvent(this.mapViewport, EventType.MOUSEMOVE, this.mapMouseMoveHandler, this);
    this.map.un('dblclick', this.mapDoubleClickHandler, this);
  };

  PlotDraw.prototype.drawEnd = function drawEnd(event) {
    this.dispatchSync('drawEnd', {
      type: 'drawEnd',
      originalEvent: event,
      feature: this.feature
    });
    if (this.feature && this.options['isClear']) {
      this.drawLayer.getSource().removeFeature(this.feature);
    }
    this.activateMapTools();
    this.removeEventHandlers();
    this.map.removeOverlay(this.drawOverlay);
    this.points = [];
    this.plot = null;
    this.plotType = null;
    this.plotParams = null;
    this.feature = null;
  };

  PlotDraw.prototype.addFeature = function addFeature() {
    this.feature = new Feature(this.plot);
    if (this.feature && this.drawLayer) {
      this.drawLayer.getSource().addFeature(this.feature);
    }
  };

  PlotDraw.prototype.deactiveMapTools = function deactiveMapTools() {
    var _this2 = this;

    var interactions = this.map.getInteractions().getArray();
    interactions.every(function (item) {
      if (item instanceof interaction.DoubleClickZoom) {
        _this2.dblClickZoomInteraction = item;
        _this2.map.removeInteraction(item);
        return false;
      } else {
        return true;
      }
    });
  };

  PlotDraw.prototype.activateMapTools = function activateMapTools() {
    if (this.dblClickZoomInteraction && this.dblClickZoomInteraction instanceof interaction.DoubleClickZoom) {
      this.map.addInteraction(this.dblClickZoomInteraction);
      this.dblClickZoomInteraction = null;
    }
  };

  return PlotDraw;
}();

var MaptalksPlot = function MaptalksPlot(map) {
  classCallCheck(this, MaptalksPlot);

  this.plotDraw = new PlotDraw(map);
};

MaptalksPlot.PlotTypes = PlotTypes;

export default MaptalksPlot;
