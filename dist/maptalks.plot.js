/*!
 * maptalks.plot v0.0.0
 * LICENSE : MIT
 * (c) 2017-2017 https://sakitam-fdd.github.io/maptalks.plot
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks')) :
	typeof define === 'function' && define.amd ? define(['exports', 'maptalks'], factory) :
	(factory((global.MaptalksPlot = {}),global.maptalks));
}(this, (function (exports,maptalks) { 'use strict';

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

var BASE_LAYERNAME = 'maptalks-plot-vector-layer';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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

var Canvas2d = maptalks.Canvas;
var options = {
  'arcDegree': 90
};

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

  Curve.prototype._toJSON = function _toJSON(options) {
    return {
      'feature': this.toGeoJSON(options),
      'subType': 'Curve'
    };
  };

  Curve.prototype._paintOn = function _paintOn(ctx, points, lineOpacity) {
    ctx.beginPath();
    this._arc(ctx, points, lineOpacity);
    Canvas2d._stroke(ctx, lineOpacity);
    this._paintArrow(ctx, points, lineOpacity);
  };

  Curve.fromJSON = function fromJSON(json) {
    var feature = json['feature'];
    var arc = new Curve(feature['geometry']['coordinates'], json['options']);
    arc.setProperties(feature['properties']);
    return arc;
  };

  return Curve;
}(maptalks.LineString);

Curve.registerJSONType('Curve');
Curve.mergeOptions(options);

var Coordinate$1 = maptalks.Coordinate;
var options$1 = {
  'arrowStyle': null,
  'arrowPlacement': 'vertex-last',
  'clipToPaint': true
};

var Polyline = function (_maptalks$LineString) {
  inherits(Polyline, _maptalks$LineString);

  function Polyline(coordinates) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Polyline);

    var _this = possibleConstructorReturn(this, _maptalks$LineString.call(this, options));

    _this.type = 'Polyline';
    if (coordinates) {
      _this.setCoordinates(coordinates);
    }
    return _this;
  }

  Polyline.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
    var points = this.getCoordinates();
    var coordinates = Coordinate$1.toNumberArrays(points);
    return {
      'type': 'LineString',
      'coordinates': coordinates
    };
  };

  Polyline.prototype._toJSON = function _toJSON(options) {
    return {
      'feature': this.toGeoJSON(options)
    };
  };

  return Polyline;
}(maptalks.LineString);

Polyline.mergeOptions(options$1);

Polyline.registerJSONType('Polyline');

var Coordinate$2 = maptalks.Coordinate;
var options$2 = {
  'arrowStyle': null,
  'arrowPlacement': 'vertex-last',
  'clipToPaint': true
};

var FreeLine = function (_maptalks$LineString) {
  inherits(FreeLine, _maptalks$LineString);

  function FreeLine(coordinates) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, FreeLine);

    var _this = possibleConstructorReturn(this, _maptalks$LineString.call(this, options));

    _this.type = 'FreeLine';
    if (coordinates) {
      _this.setCoordinates(coordinates);
    }
    return _this;
  }

  FreeLine.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
    var points = this.getCoordinates();
    var coordinates = Coordinate$2.toNumberArrays(points);
    return {
      'type': 'LineString',
      'coordinates': coordinates
    };
  };

  FreeLine.prototype._toJSON = function _toJSON(options) {
    return {
      'feature': this.toGeoJSON(options)
    };
  };

  return FreeLine;
}(maptalks.LineString);

FreeLine.mergeOptions(options$2);

FreeLine.registerJSONType('FreeLine');

var RegisterModes = {};
RegisterModes[CURVE] = {
  'action': ['click', 'click', 'dbclick'],
  'create': function create(path) {
    return new Curve(path);
  },
  'update': function update(path, geometry) {
    geometry.setCoordinates(path);
  },
  'generate': function generate(geometry) {
    return geometry;
  }
};
RegisterModes[POLYLINE] = {
  'action': ['click', 'mousemove', 'dbclick'],
  'create': function create(path) {
    return new Polyline(path);
  },
  'update': function update(path, geometry) {
    geometry.setCoordinates(path);
  },
  'generate': function generate(geometry) {
    return geometry;
  }
};
RegisterModes[FREE_LINE] = {
  'action': ['mousedown', 'drag', 'mouseup'],
  'create': function create(path) {
    return new FreeLine(path);
  },
  'update': function update(path, geometry) {
    geometry.setCoordinates(path);
  },
  'generate': function generate(geometry) {
    return geometry;
  }
};

var isObject = function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return value !== null && (type === 'object' || type === 'function');
};

var merge = function merge(a, b) {
  for (var key in b) {
    if (isObject(b[key]) && isObject(a[key])) {
      merge(a[key], b[key]);
    } else {
      a[key] = b[key];
    }
  }
  return a;
};

var _options = {
  'symbol': {
    'lineColor': '#000',
    'lineWidth': 2,
    'lineOpacity': 1,
    'polygonFill': '#fff',
    'polygonOpacity': 0.3
  },
  'doubleClickZoom': false,
  'mode': null,
  'once': false,
  'ignoreMouseleave': true
};
var registeredMode = {};
var stopPropagation = function stopPropagation(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.cancelBubble = true;
  }
  return this;
};

var PlotDraw = function (_maptalks$MapTool) {
  inherits(PlotDraw, _maptalks$MapTool);

  function PlotDraw() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, PlotDraw);

    var $options = merge(_options, options);

    var _this = possibleConstructorReturn(this, _maptalks$MapTool.call(this, $options));

    _this.options = $options;
    if (_this.options['mode']) _this._getRegisterMode();

    _this.layerName = _this.options && _this.options['layerName'] ? _this.options['layerName'] : BASE_LAYERNAME;

    _this.drawLayer = null;
    return _this;
  }

  PlotDraw.prototype._getRegisterMode = function _getRegisterMode() {
    var mode = this.getMode();
    var registerMode = PlotDraw.getRegisterMode(mode);
    if (!registerMode) {
      throw new Error(mode + ' is not a valid type of PlotDraw.');
    }
    return registerMode;
  };

  PlotDraw.prototype.setMode = function setMode(mode) {
    this._clearStage();
    this._switchEvents('off');
    this.options['mode'] = mode;
    this._getRegisterMode();
    if (this.isEnabled()) {
      this._switchEvents('on');
      this._deactiveMapInteractions();
    }
    return this;
  };

  PlotDraw.prototype.getMode = function getMode() {
    if (this.options['mode']) {
      return this.options['mode'].toLowerCase();
    }
    return null;
  };

  PlotDraw.prototype._deactiveMapInteractions = function _deactiveMapInteractions() {
    var map = this.getMap();
    this._mapDoubleClickZoom = map.options['doubleClickZoom'];
    map.config({
      'doubleClickZoom': this.options['doubleClickZoom']
    });
    var action = this._getRegisterMode()['action'];
    if (action.indexOf('drag') > -1) {
      var _map = this.getMap();
      this._mapDraggable = _map.options['draggable'];
      _map.config({
        'draggable': false
      });
    }
  };

  PlotDraw.prototype._activateMapInteractions = function _activateMapInteractions() {
    var map = this.getMap();
    map.config({
      'doubleClickZoom': this._mapDoubleClickZoom
    });
    if (this._mapDraggable) {
      map.config('draggable', this._mapDraggable);
    }
    delete this._mapDraggable;
    delete this._mapDoubleClickZoom;
  };

  PlotDraw.prototype.getEvents = function getEvents() {
    var action = this._getRegisterMode()['action'];
    if (Array.isArray(action)) {
      return {
        'click': this._firstClickHandler,
        'mousemove': this._mouseMoveHandler,
        'dblclick': this._doubleClickHandler
      };
    }
    return null;
  };

  PlotDraw.prototype._firstClickHandler = function _firstClickHandler(event) {
    var registerMode = this._getRegisterMode();
    var coordinate = event['coordinate'];
    var symbol = this.getSymbol();
    if (!this._geometry) {
      this._clickCoords = [coordinate];
      this._geometry = registerMode['create'](this._clickCoords, event);
      if (symbol) {
        this._geometry.setSymbol(symbol);
      }
      this._addGeometryToStage(this._geometry);
      this._fireEvent('drawstart', event);
    } else {
      if (!(this._historyPointer === null)) {
        this._clickCoords = this._clickCoords.slice(0, this._historyPointer);
      }
      this._clickCoords.push(coordinate);
      this._historyPointer = this._clickCoords.length;
      registerMode['update'](this._clickCoords, this._geometry, event);
      this._fireEvent('drawvertex', event);
    }
  };

  PlotDraw.prototype._mouseMoveHandler = function _mouseMoveHandler(event) {
    var map = this.getMap();
    if (!this._geometry || !map || map.isInteracting()) {
      return;
    }
    var containerPoint = this._getMouseContainerPoint(event);
    if (!this._isValidContainerPoint(containerPoint)) {
      return;
    }
    var coordinate = event['coordinate'];
    var registerMode = this._getRegisterMode();
    var path = this._clickCoords.slice(0, this._historyPointer);
    if (path && path.length > 0 && coordinate.equals(path[path.length - 1])) {
      return;
    }
    registerMode['update'](path.concat([coordinate]), this._geometry, event);
    this._fireEvent('mousemove', event);
  };

  PlotDraw.prototype._doubleClickHandler = function _doubleClickHandler(event) {
    this.endDraw(event);
  };

  PlotDraw.prototype._getMouseContainerPoint = function _getMouseContainerPoint(event) {
    var action = this._getRegisterMode()['action'];
    if (action.indexOf('drag') > -1) {
      stopPropagation(event['domEvent']);
    }
    return event['containerPoint'];
  };

  PlotDraw.prototype._isValidContainerPoint = function _isValidContainerPoint(containerPoint) {
    var mapSize = this._map.getSize();
    var w = mapSize['width'];
    var h = mapSize['height'];
    if (containerPoint.x < 0 || containerPoint.y < 0) {
      return false;
    } else if (containerPoint.x > w || containerPoint.y > h) {
      return false;
    }
    return true;
  };

  PlotDraw.prototype._clearStage = function _clearStage() {
    this._getDrawLayer(this.layerName).clear();
    if (this._geometry) {
      this._geometry.remove();
      delete this._geometry;
    }
    delete this._clickCoords;
  };

  PlotDraw.prototype._addGeometryToStage = function _addGeometryToStage(geometry) {
    this._getDrawLayer(this.layerName).addGeometry(geometry);
  };

  PlotDraw.prototype.setSymbol = function setSymbol(symbol) {
    if (!symbol) {
      return this;
    }
    this.options['symbol'] = symbol;
    if (this._geometry) {
      this._geometry.setSymbol(symbol);
    }
    return this;
  };

  PlotDraw.prototype.getSymbol = function getSymbol() {
    var symbol = this.options['symbol'];
    if (symbol) {
      return maptalks.Util.extendSymbol(symbol);
    } else {
      return maptalks.Util.extendSymbol(this.options['symbol']);
    }
  };

  PlotDraw.prototype._getDrawLayer = function _getDrawLayer(layerName) {
    var drawToolLayer = this._map.getLayer(layerName);
    if (!drawToolLayer) {
      drawToolLayer = new maptalks.VectorLayer(layerName, {
        'enableSimplify': false
      });
      this._map.addLayer(drawToolLayer);
    }
    return drawToolLayer;
  };

  PlotDraw.prototype._fireEvent = function _fireEvent(eventName) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (this._geometry) {
      param['geometry'] = this._getRegisterMode()['generate'](this._geometry).copy();
    }
    maptalks.MapTool.prototype._fireEvent.call(this, eventName, param);
  };

  PlotDraw.prototype.onAdd = function onAdd() {
    this._getRegisterMode();
  };

  PlotDraw.prototype.onEnable = function onEnable() {
    this._deactiveMapInteractions();
    this.drawLayer = this._getDrawLayer(this.layerName);
    this._clearStage();
    this._loadResources();
    return this;
  };

  PlotDraw.prototype.onDisable = function onDisable() {
    var map = this.getMap();
    this._activateMapInteractions();
    this.endDraw();
    if (this._map) {
      map.removeLayer(this._getDrawLayer(this.layerName));
    }
    return this;
  };

  PlotDraw.prototype.endDraw = function endDraw() {
    var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!this._geometry || this._ending) {
      return this;
    }
    this._ending = true;
    var geometry = this._geometry;
    this._clearStage();
    this._geometry = geometry;
    this._fireEvent('drawend', param);
    delete this._geometry;
    if (this.options['once']) {
      this.disable();
    }
    delete this._ending;
    return this;
  };

  PlotDraw.prototype._loadResources = function _loadResources() {
    var symbol = this.getSymbol();
    var resources = maptalks.Util.getExternalResources(symbol);
    if (resources.length > 0) {
      this.drawLayer._getRenderer().loadResources(resources);
    }
  };

  PlotDraw.registerMode = function registerMode(name, modeAction) {
    registeredMode[name.toLowerCase()] = modeAction;
  };

  PlotDraw.getRegisterMode = function getRegisterMode(name) {
    return registeredMode[name.toLowerCase()];
  };

  PlotDraw.registeredModes = function registeredModes(modes) {
    if (modes) {
      for (var _iterator = Reflect.ownKeys(modes), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var key = _ref;

        if (!key.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
          var desc = Object.getOwnPropertyDescriptor(modes, key);
          var _key = key.toLowerCase();
          Object.defineProperty(registeredMode, _key, desc);
          console.log(registeredMode);
        }
      }
    }
  };

  return PlotDraw;
}(maptalks.MapTool);

PlotDraw.registeredModes(RegisterModes);

exports.PlotDraw = PlotDraw;
exports.PlotTypes = PlotTypes;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=maptalks.plot.js.map
