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

var FITTING_COUNT = 100;

var ZERO_TOLERANCE = 0.0001;

var BASE_LAYERNAME = 'maptalks-plot-vector-layer';

var MathDistance = function MathDistance(pnt1, pnt2) {
  return Math.sqrt(Math.pow(pnt1[0] - pnt2[0], 2) + Math.pow(pnt1[1] - pnt2[1], 2));
};





var Mid = function Mid(point1, point2) {
  return [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2];
};

var getCircleCenterOfThreePoints = function getCircleCenterOfThreePoints(point1, point2, point3) {
  var pntA = [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2];
  var pntB = [pntA[0] - point1[1] + point2[1], pntA[1] + point1[0] - point2[0]];
  var pntC = [(point1[0] + point3[0]) / 2, (point1[1] + point3[1]) / 2];
  var pntD = [pntC[0] - point1[1] + point3[1], pntC[1] + point1[0] - point3[0]];
  return getIntersectPoint(pntA, pntB, pntC, pntD);
};

var getIntersectPoint = function getIntersectPoint(pntA, pntB, pntC, pntD) {
  if (pntA[1] === pntB[1]) {
    var _f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1]);
    var _x = _f * (pntA[1] - pntC[1]) + pntC[0];
    var _y = pntA[1];
    return [_x, _y];
  }
  if (pntC[1] === pntD[1]) {
    var _e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1]);
    var _x2 = _e * (pntC[1] - pntA[1]) + pntA[0];
    var _y2 = pntC[1];
    return [_x2, _y2];
  }
  var e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1]);
  var f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1]);
  var y = (e * pntA[1] - pntA[0] - f * pntC[1] + pntC[0]) / (e - f);
  var x = e * y - e * pntA[1] + pntA[0];
  return [x, y];
};

var getAzimuth = function getAzimuth(startPoint, endPoint) {
  var azimuth = void 0;
  var angle = Math.asin(Math.abs(endPoint[1] - startPoint[1]) / MathDistance(startPoint, endPoint));
  if (endPoint[1] >= startPoint[1] && endPoint[0] >= startPoint[0]) {
    azimuth = angle + Math.PI;
  } else if (endPoint[1] >= startPoint[1] && endPoint[0] < startPoint[0]) {
    azimuth = Math.PI * 2 - angle;
  } else if (endPoint[1] < startPoint[1] && endPoint[0] < startPoint[0]) {
    azimuth = angle;
  } else if (endPoint[1] < startPoint[1] && endPoint[0] >= startPoint[0]) {
    azimuth = Math.PI - angle;
  }
  return azimuth;
};



var isClockWise = function isClockWise(pnt1, pnt2, pnt3) {
  return (pnt3[1] - pnt1[1]) * (pnt2[0] - pnt1[0]) > (pnt2[1] - pnt1[1]) * (pnt3[0] - pnt1[0]);
};



var getCubicValue = function getCubicValue(t, startPnt, cPnt1, cPnt2, endPnt) {
  t = Math.max(Math.min(t, 1), 0);
  var tp = 1 - t,
      t2 = t * t;

  var t3 = t2 * t;
  var tp2 = tp * tp;
  var tp3 = tp2 * tp;
  var x = tp3 * startPnt[0] + 3 * tp2 * t * cPnt1[0] + 3 * tp * t2 * cPnt2[0] + t3 * endPnt[0];
  var y = tp3 * startPnt[1] + 3 * tp2 * t * cPnt1[1] + 3 * tp * t2 * cPnt2[1] + t3 * endPnt[1];
  return [x, y];
};



var getArcPoints = function getArcPoints(center, radius, startAngle, endAngle) {
  var x = null,
      y = null,
      pnts = [],
      angleDiff = endAngle - startAngle;

  angleDiff = angleDiff < 0 ? angleDiff + Math.PI * 2 : angleDiff;
  for (var i = 0; i < 100; i++) {
    var angle = startAngle + angleDiff * i / 100;
    x = center[0] + radius * Math.cos(angle);
    y = center[1] + radius * Math.sin(angle);
    pnts.push([x, y]);
  }
  return pnts;
};

var getBisectorNormals = function getBisectorNormals(t, pnt1, pnt2, pnt3) {
  var normal = getNormal(pnt1, pnt2, pnt3);
  var bisectorNormalRight = null,
      bisectorNormalLeft = null,
      dt = null,
      x = null,
      y = null;

  var dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
  var uX = normal[0] / dist;
  var uY = normal[1] / dist;
  var d1 = MathDistance(pnt1, pnt2);
  var d2 = MathDistance(pnt2, pnt3);
  if (dist > ZERO_TOLERANCE) {
    if (isClockWise(pnt1, pnt2, pnt3)) {
      dt = t * d1;
      x = pnt2[0] - dt * uY;
      y = pnt2[1] + dt * uX;
      bisectorNormalRight = [x, y];
      dt = t * d2;
      x = pnt2[0] + dt * uY;
      y = pnt2[1] - dt * uX;
      bisectorNormalLeft = [x, y];
    } else {
      dt = t * d1;
      x = pnt2[0] + dt * uY;
      y = pnt2[1] - dt * uX;
      bisectorNormalRight = [x, y];
      dt = t * d2;
      x = pnt2[0] - dt * uY;
      y = pnt2[1] + dt * uX;
      bisectorNormalLeft = [x, y];
    }
  } else {
    x = pnt2[0] + t * (pnt1[0] - pnt2[0]);
    y = pnt2[1] + t * (pnt1[1] - pnt2[1]);
    bisectorNormalRight = [x, y];
    x = pnt2[0] + t * (pnt3[0] - pnt2[0]);
    y = pnt2[1] + t * (pnt3[1] - pnt2[1]);
    bisectorNormalLeft = [x, y];
  }
  return [bisectorNormalRight, bisectorNormalLeft];
};

var getNormal = function getNormal(pnt1, pnt2, pnt3) {
  var dX1 = pnt1[0] - pnt2[0];
  var dY1 = pnt1[1] - pnt2[1];
  var d1 = Math.sqrt(dX1 * dX1 + dY1 * dY1);
  dX1 /= d1;
  dY1 /= d1;
  var dX2 = pnt3[0] - pnt2[0];
  var dY2 = pnt3[1] - pnt2[1];
  var d2 = Math.sqrt(dX2 * dX2 + dY2 * dY2);
  dX2 /= d2;
  dY2 /= d2;
  var uX = dX1 + dX2;
  var uY = dY1 + dY2;
  return [uX, uY];
};

var getLeftMostControlPoint = function getLeftMostControlPoint(controlPoints, t) {
  var _ref = [controlPoints[0], controlPoints[1], controlPoints[2], null, null],
      pnt1 = _ref[0],
      pnt2 = _ref[1],
      pnt3 = _ref[2],
      controlX = _ref[3],
      controlY = _ref[4];

  var pnts = getBisectorNormals(0, pnt1, pnt2, pnt3);
  var normalRight = pnts[0];
  var normal = getNormal(pnt1, pnt2, pnt3);
  var dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
  if (dist > ZERO_TOLERANCE) {
    var mid = Mid(pnt1, pnt2);
    var pX = pnt1[0] - mid[0];
    var pY = pnt1[1] - mid[1];
    var d1 = MathDistance(pnt1, pnt2);
    var n = 2.0 / d1;
    var nX = -n * pY;
    var nY = n * pX;
    var a11 = nX * nX - nY * nY;
    var a12 = 2 * nX * nY;
    var a22 = nY * nY - nX * nX;
    var dX = normalRight[0] - mid[0];
    var dY = normalRight[1] - mid[1];
    controlX = mid[0] + a11 * dX + a12 * dY;
    controlY = mid[1] + a12 * dX + a22 * dY;
  } else {
    controlX = pnt1[0] + t * (pnt2[0] - pnt1[0]);
    controlY = pnt1[1] + t * (pnt2[1] - pnt1[1]);
  }
  return [controlX, controlY];
};

var getRightMostControlPoint = function getRightMostControlPoint(controlPoints, t) {
  var count = controlPoints.length;
  var pnt1 = controlPoints[count - 3];
  var pnt2 = controlPoints[count - 2];
  var pnt3 = controlPoints[count - 1];
  var pnts = getBisectorNormals(0, pnt1, pnt2, pnt3);
  var normalLeft = pnts[1];
  var normal = getNormal(pnt1, pnt2, pnt3);
  var dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
  var controlX = null,
      controlY = null;

  if (dist > ZERO_TOLERANCE) {
    var mid = Mid(pnt2, pnt3);
    var pX = pnt3[0] - mid[0];
    var pY = pnt3[1] - mid[1];
    var d1 = MathDistance(pnt2, pnt3);
    var n = 2.0 / d1;
    var nX = -n * pY;
    var nY = n * pX;
    var a11 = nX * nX - nY * nY;
    var a12 = 2 * nX * nY;
    var a22 = nY * nY - nX * nX;
    var dX = normalLeft[0] - mid[0];
    var dY = normalLeft[1] - mid[1];
    controlX = mid[0] + a11 * dX + a12 * dY;
    controlY = mid[1] + a12 * dX + a22 * dY;
  } else {
    controlX = pnt3[0] + t * (pnt2[0] - pnt3[0]);
    controlY = pnt3[1] + t * (pnt2[1] - pnt3[1]);
  }
  return [controlX, controlY];
};

var getCurvePoints = function getCurvePoints(t, controlPoints) {
  var leftControl = getLeftMostControlPoint(controlPoints, t);
  var pnt1 = null,
      pnt2 = null,
      pnt3 = null,
      normals = [leftControl],
      points = [];

  for (var i = 0; i < controlPoints.length - 2; i++) {
    var _ref2 = [controlPoints[i], controlPoints[i + 1], controlPoints[i + 2]];
    pnt1 = _ref2[0];
    pnt2 = _ref2[1];
    pnt3 = _ref2[2];

    var normalPoints = getBisectorNormals(t, pnt1, pnt2, pnt3);
    normals = normals.concat(normalPoints);
  }
  var rightControl = getRightMostControlPoint(controlPoints, t);
  if (rightControl) {
    normals.push(rightControl);
  }
  for (var _i = 0; _i < controlPoints.length - 1; _i++) {
    pnt1 = controlPoints[_i];
    pnt2 = controlPoints[_i + 1];
    points.push(pnt1);
    for (var _t = 0; _t < FITTING_COUNT; _t++) {
      var pnt = getCubicValue(_t / FITTING_COUNT, pnt1, normals[_i * 2], normals[_i * 2 + 1], pnt2);
      points.push(pnt);
    }
    points.push(pnt2);
  }
  return points;
};

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

var Coordinate$1 = maptalks.Coordinate;
var options = {
  'arrowStyle': null,
  'arrowPlacement': 'vertex-last',
  'clipToPaint': true
};

var Arc = function (_maptalks$LineString) {
  inherits(Arc, _maptalks$LineString);

  function Arc(coordinates) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Arc);

    var _this = possibleConstructorReturn(this, _maptalks$LineString.call(this, options));

    _this.type = 'Arc';
    _this._coordinates = [];
    if (coordinates) {
      _this.setPoints(coordinates);
    }
    return _this;
  }

  Arc.prototype._generate = function _generate() {
    var count = this._coordinates.length;
    if (count < 2) return;
    if (count === 2) {
      this.setCoordinates(this._coordinates);
    } else {
      var _ref = [this._coordinates[0], this._coordinates[1], this._coordinates[2], null, null],
          pnt1 = _ref[0],
          pnt2 = _ref[1],
          pnt3 = _ref[2],
          startAngle = _ref[3],
          endAngle = _ref[4];

      var center = getCircleCenterOfThreePoints([pnt1['x'], pnt1['y']], [pnt2['x'], pnt2['y']], [pnt3['x'], pnt3['y']]);
      var radius = MathDistance([pnt1['x'], pnt1['y']], center);
      var angle1 = getAzimuth([pnt1['x'], pnt1['y']], center);
      var angle2 = getAzimuth([pnt2['x'], pnt2['y']], center);
      if (isClockWise([pnt1['x'], pnt1['y']], [pnt2['x'], pnt2['y']], [pnt3['x'], pnt3['y']])) {
        startAngle = angle2;
        endAngle = angle1;
      } else {
        startAngle = angle1;
        endAngle = angle2;
      }
      var points = getArcPoints(center, radius, startAngle, endAngle);
      if (Array.isArray(points)) {
        var _points = points.map(function (_item) {
          if (Array.isArray(_item)) {
            if (!isNaN(_item[0]) && !isNaN(_item[1])) {
              return new Coordinate$1(_item[0], _item[1]);
            }
          } else {
            return _item;
          }
        });
        this.setCoordinates(_points);
      }
    }
  };

  Arc.prototype.setPoints = function setPoints(coordinates) {
    this._coordinates = !coordinates ? [] : coordinates;
    if (this._coordinates.length >= 1) {
      this._generate();
    }
  };

  Arc.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
    var points = this.getCoordinates();
    var coordinates = Coordinate$1.toNumberArrays(points);
    return {
      'type': 'LineString',
      'coordinates': coordinates
    };
  };

  Arc.prototype._toJSON = function _toJSON(options) {
    return {
      'feature': this.toGeoJSON(options)
    };
  };

  return Arc;
}(maptalks.LineString);

Arc.mergeOptions(options);

Arc.registerJSONType('Arc');

var Coordinate$2 = maptalks.Coordinate;
var options$1 = {
  'arrowStyle': null,
  'arrowPlacement': 'vertex-last',
  'clipToPaint': true
};

var Curve = function (_maptalks$LineString) {
  inherits(Curve, _maptalks$LineString);

  function Curve(coordinates) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Curve);

    var _this = possibleConstructorReturn(this, _maptalks$LineString.call(this, options));

    _this.type = 'Curve';
    _this._coordinates = [];
    if (coordinates) {
      _this.setPoints(coordinates);
    }
    return _this;
  }

  Curve.prototype._generate = function _generate() {
    var count = this._coordinates.length;
    if (count < 2) {
      return false;
    } else if (count === 2) {
      this.setCoordinates(this._coordinates);
    } else {
      var _coordinates = this._coordinates.map(function (_item) {
        if (_item && _item.hasOwnProperty('x')) {
          return [_item['x'], _item['y']];
        } else if (Array.isArray(_item)) {
          return _item;
        }
      });
      var points = getCurvePoints(0.3, _coordinates);
      if (Array.isArray(points)) {
        var _points = points.map(function (_item) {
          if (Array.isArray(_item)) {
            return new Coordinate$2(_item[0], _item[1]);
          } else {
            return _item;
          }
        });
        this.setCoordinates(_points);
      }
    }
  };

  Curve.prototype.setPoints = function setPoints(coordinates) {
    this._coordinates = !coordinates ? [] : coordinates;
    if (this._coordinates.length >= 1) {
      this._generate();
    }
  };

  Curve.prototype._toJSON = function _toJSON(options) {
    return {
      'feature': this.toGeoJSON(options),
      'subType': 'Curve'
    };
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
Curve.mergeOptions(options$1);

var Coordinate$3 = maptalks.Coordinate;
var options$2 = {
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

  Polyline.prototype.setPoints = function setPoints(coordinates) {
    if (coordinates) {
      this.setCoordinates(coordinates);
    }
  };

  Polyline.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
    var points = this.getCoordinates();
    var coordinates = Coordinate$3.toNumberArrays(points);
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

Polyline.mergeOptions(options$2);

Polyline.registerJSONType('Polyline');

var Coordinate$4 = maptalks.Coordinate;
var options$3 = {
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

  FreeLine.prototype.setPoints = function setPoints(coordinates) {
    if (coordinates) {
      this.setCoordinates(coordinates);
    }
  };

  FreeLine.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
    var points = this.getCoordinates();
    var coordinates = Coordinate$4.toNumberArrays(points);
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

FreeLine.mergeOptions(options$3);

FreeLine.registerJSONType('FreeLine');

var RegisterModes = {};
RegisterModes[ARC] = {
  'freehand': false,
  'limitClickCount': 3,
  'action': ['click', 'mousemove'],
  'create': function create(path) {
    return new Arc(path);
  },
  'update': function update(path, geometry) {
    geometry.setPoints(path);
  },
  'generate': function generate(geometry) {
    return geometry;
  }
};
RegisterModes[CURVE] = {
  'freehand': false,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function create(path) {
    return new Curve(path);
  },
  'update': function update(path, geometry) {
    geometry.setPoints(path);
  },
  'generate': function generate(geometry) {
    return geometry;
  }
};
RegisterModes[POLYLINE] = {
  'freehand': false,
  'action': ['click', 'mousemove', 'dblclick'],
  'create': function create(path) {
    return new Polyline(path);
  },
  'update': function update(path, geometry) {
    geometry.setPoints(path);
  },
  'generate': function generate(geometry) {
    return geometry;
  }
};
RegisterModes[FREE_LINE] = {
  'freehand': true,
  'action': ['mousedown', 'drag', 'mouseup'],
  'create': function create(path) {
    return new FreeLine(path);
  },
  'update': function update(path, geometry) {
    geometry.setPoints(path);
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

    _this.events = {
      'click': _this._firstClickHandler,
      'mousemove': _this._mouseMoveHandler,
      'dblclick': _this._doubleClickHandler,
      'mousedown': _this._mouseDownHandler,
      'mouseup': _this._mouseUpHandler,
      'drag': _this._mouseMoveHandler
    };
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
    var _events = {};
    if (Array.isArray(action)) {
      for (var i = 0; i < action.length; i++) {
        if (action[i] === 'drag') {
          _events['mousemove'] = this.events[action[i]];
        } else {
          _events[action[i]] = this.events[action[i]];
        }
      }
      return _events;
    }
    return null;
  };

  PlotDraw.prototype._mouseDownHandler = function _mouseDownHandler(event) {
    this._createGeometry(event);
  };

  PlotDraw.prototype._mouseUpHandler = function _mouseUpHandler(event) {
    this.endDraw(event);
  };

  PlotDraw.prototype._firstClickHandler = function _firstClickHandler(event) {
    this._createGeometry(event);
    var registerMode = this._getRegisterMode();
    var coordinate = event['coordinate'];
    if (this._geometry) {
      if (!(this._historyPointer === null)) {
        this._clickCoords = this._clickCoords.slice(0, this._historyPointer);
      }
      this._clickCoords.push(coordinate);
      this._historyPointer = this._clickCoords.length;
      if (registerMode['limitClickCount'] && registerMode['limitClickCount'] === this._historyPointer) {
        registerMode['update'](this._clickCoords, this._geometry, event);
        this.endDraw(event);
      } else {
        registerMode['update'](this._clickCoords, this._geometry, event);
      }
      this._fireEvent('drawvertex', event);
    }
  };

  PlotDraw.prototype._createGeometry = function _createGeometry(event) {
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
    if (!registerMode.freehand) {
      registerMode['update'](path.concat([coordinate]), this._geometry, event);
    } else {
      if (!(this._historyPointer === null)) {
        this._clickCoords = this._clickCoords.slice(0, this._historyPointer);
      }
      this._clickCoords.push(coordinate);
      this._historyPointer = this._clickCoords.length;
      registerMode['update'](this._clickCoords, this._geometry, event);
    }
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
