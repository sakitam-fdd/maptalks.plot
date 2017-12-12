/**
 * Created by FDD on 2017/12/10.
 * @desc PlotDraw
 */

import * as maptalks from 'maptalks'
import RegisterModes from '../geometry'
import { merge } from '../utils/utils'
const Polygon = maptalks.Polygon
const _options = {
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
}
const registeredMode = {}
class PlotDraw extends maptalks.DrawTool {
  constructor (options = {}) {
    const $options = merge(_options, options)
    super($options)
    this.options = $options
    this._checkMode()
  }

  _getRegisterMode () {
    const mode = this.getMode()
    const registerMode = PlotDraw.getRegisterMode(mode)
    if (!registerMode) {
      throw new Error(mode + ' is not a valid mode of DrawTool.')
    }
    return registerMode
  }

  /**
   * Set draw tool's symbol
   * @param {Object} symbol - symbol set
   * @returns {DrawTool} this
   */
  setSymbol (symbol) {
    if (!symbol) {
      return this
    }
    this.options['symbol'] = symbol
    if (this._geometry) {
      this._geometry.setSymbol(symbol)
    }
    return this
  }

  /**
   * click fro path
   * @param param
   * @private
   */
  _clickForPath (param) {
    const registerMode = this._getRegisterMode()
    const coordinate = param['coordinate']
    const symbol = this.getSymbol()
    if (!this._geometry) {
      this._clickCoords = [coordinate]
      this._geometry = registerMode['create'](this._clickCoords, param)
      if (symbol) {
        this._geometry.setSymbol(symbol)
      }
      this._addGeometryToStage(this._geometry)

      /**
       * drawstart event.
       */
      this._fireEvent('drawstart', param)
    } else {
      if (!(this._historyPointer === null)) {
        this._clickCoords = this._clickCoords.slice(0, this._historyPointer)
      }
      this._clickCoords.push(coordinate)
      this._historyPointer = this._clickCoords.length
      registerMode['update'](this._clickCoords, this._geometry, param)

      /**
       * drawvertex event.
       */
      this._fireEvent('drawvertex', param)
    }
  }

  /**
   * mouse move fro path
   * @param param
   * @private
   */
  _mousemoveForPath (param) {
    const map = this.getMap()
    if (!this._geometry || !map || map.isInteracting()) {
      return
    }
    const containerPoint = this._getMouseContainerPoint(param)
    if (!this._isValidContainerPoint(containerPoint)) {
      return
    }
    const coordinate = param['coordinate']
    const registerMode = this._getRegisterMode()
    const path = this._clickCoords.slice(0, this._historyPointer)
    if (path && path.length > 0 && coordinate.equals(path[path.length - 1])) {
      return
    }
    registerMode['update'](path.concat([coordinate]), this._geometry, param)

    /**
     * mousemove event
     */
    this._fireEvent('mousemove', param)
  }

  /**
   * dbclick fro path
   * @param param
   * @private
   */
  _dblclickForPath (param) {
    if (!this._geometry) {
      return
    }
    const containerPoint = this._getMouseContainerPoint(param)
    if (!this._isValidContainerPoint(containerPoint)) {
      return
    }
    const registerMode = this._getRegisterMode()
    const coordinate = param['coordinate']
    const path = this._clickCoords
    path.push(coordinate)
    if (path.length < 2) {
      return
    }
    // 去除重复的端点
    const nIndexes = []
    for (let i = 1, len = path.length; i < len; i++) {
      if (path[i].x === path[i - 1].x && path[i].y === path[i - 1].y) {
        nIndexes.push(i)
      }
    }
    for (let i = nIndexes.length - 1; i >= 0; i--) {
      path.splice(nIndexes[i], 1)
    }

    if (path.length < 2 || (this._geometry && (this._geometry instanceof Polygon) && path.length < 3)) {
      return
    }
    registerMode['update'](path, this._geometry, param)
    this.endDraw(param)
  }

  /**
   * mouseup for path
   * @param param
   * @private
   */
  _mouseUpForPath (param) {
    if (!this._geometry) {
      return
    }
    const containerPoint = this._getMouseContainerPoint(param)
    if (!this._isValidContainerPoint(containerPoint)) {
      return
    }
    const registerMode = this._getRegisterMode()
    const coordinate = param['coordinate']
    const path = this._clickCoords
    path.push(coordinate)
    if (path.length < 2) {
      return
    }
    // 去除重复的端点
    const nIndexes = []
    for (let i = 1, len = path.length; i < len; i++) {
      if (path[i].x === path[i - 1].x && path[i].y === path[i - 1].y) {
        nIndexes.push(i)
      }
    }
    for (let i = nIndexes.length - 1; i >= 0; i--) {
      path.splice(nIndexes[i], 1)
    }

    if (path.length < 2 || (this._geometry && (this._geometry instanceof Polygon) && path.length < 3)) {
      return
    }
    registerMode['update'](path, this._geometry, param)
    this.endDraw(param)
  }

  /**
   * when nousedown start draw geometry
   * @param param
   * @returns {boolean}
   * @private
   */
  _mousedownToDraw (param) {
    const map = this._map
    const registerMode = this._getRegisterMode()
    const me = this
    const firstPoint = this._getMouseContainerPoint(param)
    if (!this._isValidContainerPoint(firstPoint)) {
      return false
    }

    function genGeometry (evt) {
      const symbol = me.getSymbol()
      let geometry = me._geometry
      if (!geometry) {
        geometry = registerMode['create'](evt.coordinate, evt)
        geometry.setSymbol(symbol)
        me._addGeometryToStage(geometry)
        me._geometry = geometry
      } else {
        registerMode['update'](evt.coordinate, geometry, evt)
      }
    }

    /**
     * handle mouse move
     * @param evt
     * @returns {boolean}
     */
    const onMouseMove = function (evt) {
      if (!this._geometry) {
        return false
      }
      const current = this._getMouseContainerPoint(evt)
      if (!this._isValidContainerPoint(current)) {
        return false
      }
      genGeometry(evt)
      this._fireEvent('mousemove', param)
      return false
    }

    /**
     * handle mouse up
     * @param evt
     * @returns {boolean}
     */
    const onMouseUp = function (evt) {
      map.off('mousemove', onMouseMove, this)
      map.off('mouseup', onMouseUp, this)
      if (!this.options['ignoreMouseleave']) {
        map.off('mouseleave', onMouseUp, this)
      }
      if (!this._geometry) {
        return false
      }
      const current = this._getMouseContainerPoint(evt)
      if (this._isValidContainerPoint(current)) {
        genGeometry(evt)
      }
      this.endDraw(param)
      return false
    }

    this._fireEvent('drawstart', param)
    genGeometry(param)
    map.on('mousemove', onMouseMove, this)
    map.on('mouseup', onMouseUp, this)
    if (!this.options['ignoreMouseleave']) {
      map.on('mouseleave', onMouseUp, this)
    }
    return false
  }

  /**
   * get register events
   * @returns {*}
   */
  getEvents () {
    const action = this._getRegisterMode()['action']
    if (action === 'clickDblclick') {
      return {
        'click': this._clickForPath,
        'mousemove': this._mousemoveForPath,
        'dblclick': this._dblclickForPath
      }
    } else if (action === 'click') {
      return {
        'click': this._clickForPoint
      }
    } else if (action === 'drag') {
      return {
        'mousedown': this._mousedownToDraw
      }
    } else if (action === 'mouseup') {
      return {
        'mousedown': this._mousedownToDraw,
        'mousemove': this._mousemoveForPath,
        'mouseup': this._mouseUpForPath
      }
    }
    return null
  }

  /**
   * Register a new mode for DrawTool
   * @param name
   * @param modeAction
   */
  static registerMode (name, modeAction) {
    registeredMode[name.toLowerCase()] = modeAction
  }

  /**
   * Get mode actions by mode name
   * @param  {String} name DrawTool mode name
   * @return {Object}      mode actions
   */
  static getRegisterMode (name) {
    return registeredMode[name.toLowerCase()]
  }

  /**
   * Register modes for DrawTool
   * @param modes
   */
  static registeredModes (modes) {
    if (modes) {
      for (let key of Reflect.ownKeys(modes)) {
        if (!key.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
          let desc = Object.getOwnPropertyDescriptor(modes, key)
          let _key = key.toLowerCase()
          Object.defineProperty(registeredMode, _key, desc)
          console.log(registeredMode)
        }
      }
    }
  }
}

PlotDraw.registeredModes(RegisterModes)

export default PlotDraw
