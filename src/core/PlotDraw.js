/**
 * Created by FDD on 2017/12/10.
 * @desc PlotDraw
 */

import * as maptalks from 'maptalks'
import {BASE_LAYERNAME} from '../Constants'
import RegisterModes from '../geometry'
import { merge } from '../utils/utils'
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
const stopPropagation = function (e) {
  if (e.stopPropagation) {
    e.stopPropagation()
  } else {
    e.cancelBubble = true
  }
  return this
}
class PlotDraw extends maptalks.MapTool {
  constructor (options = {}) {
    const $options = merge(_options, options)
    super($options)
    this.options = $options
    if (this.options['mode']) this._getRegisterMode()

    /**
     * 创建图层名称
     * @type {string}
     */
    this.layerName = ((this.options && this.options['layerName']) ? this.options['layerName'] : BASE_LAYERNAME)

    /**
     * 创建标绘要素图层
     * @type {*}
     */
    this.drawLayer = null
  }

  /**
   * 获取注册过的标绘类型
   * @returns {Object}
   * @private
   */
  _getRegisterMode () {
    const mode = this.getMode()
    const registerMode = PlotDraw.getRegisterMode(mode)
    if (!registerMode) {
      throw new Error(mode + ' is not a valid type of PlotDraw.')
    }
    return registerMode
  }

  /**
   * 激活对应工具
   * @param mode
   * @returns {PlotDraw}
   */
  setMode (mode) {
    this._clearStage()
    this._switchEvents('off') // _prototype
    this.options['mode'] = mode
    this._getRegisterMode() // cheack type
    if (this.isEnabled()) {
      this._switchEvents('on')
      this._deactiveMapInteractions()
    }
    return this
  }

  /**
   * 获取当前激活的标绘工具
   * @return {String} mode
   */
  getMode () {
    if (this.options['mode']) {
      return this.options['mode'].toLowerCase()
    }
    return null
  }

  /**
   * 取消激活地图交互并保存
   */
  _deactiveMapInteractions () {
    const map = this.getMap()
    this._mapDoubleClickZoom = map.options['doubleClickZoom']
    map.config({
      'doubleClickZoom': this.options['doubleClickZoom']
    })
    const action = this._getRegisterMode()['action']
    if (action.indexOf('drag') > -1) {
      const map = this.getMap()
      this._mapDraggable = map.options['draggable']
      map.config({
        'draggable': false
      })
    }
  }

  /**
   * 激活地图原有交互
   * @private
   */
  _activateMapInteractions () {
    const map = this.getMap()
    map.config({
      'doubleClickZoom': this._mapDoubleClickZoom
    })
    if (this._mapDraggable) {
      map.config('draggable', this._mapDraggable)
    }
    delete this._mapDraggable
    delete this._mapDoubleClickZoom
  }

  /**
   * get register events
   * @returns {*}
   */
  getEvents () {
    const action = this._getRegisterMode()['action']
    if (Array.isArray(action)) {
      return {
        'click': this._firstClickHandler,
        'mousemove': this._mouseMoveHandler,
        'dblclick': this._doubleClickHandler
      }
    }
    return null
  }

  _firstClickHandler (event) {
    const registerMode = this._getRegisterMode()
    const coordinate = event['coordinate']
    const symbol = this.getSymbol()
    if (!this._geometry) {
      this._clickCoords = [coordinate]
      this._geometry = registerMode['create'](this._clickCoords, event)
      if (symbol) {
        this._geometry.setSymbol(symbol)
      }
      this._addGeometryToStage(this._geometry)
      this._fireEvent('drawstart', event)
    } else {
      if (!(this._historyPointer === null)) {
        this._clickCoords = this._clickCoords.slice(0, this._historyPointer)
      }
      this._clickCoords.push(coordinate)
      this._historyPointer = this._clickCoords.length
      registerMode['update'](this._clickCoords, this._geometry, event)
      this._fireEvent('drawvertex', event)
    }
  }

  /**
   * 鼠标移动事件处理
   * @param event
   * @private
   */
  _mouseMoveHandler (event) {
    const map = this.getMap()
    if (!this._geometry || !map || map.isInteracting()) {
      return
    }
    const containerPoint = this._getMouseContainerPoint(event)
    if (!this._isValidContainerPoint(containerPoint)) {
      return
    }
    const coordinate = event['coordinate']
    const registerMode = this._getRegisterMode()
    const path = this._clickCoords.slice(0, this._historyPointer)
    if (path && path.length > 0 && coordinate.equals(path[path.length - 1])) {
      return
    }
    registerMode['update'](path.concat([coordinate]), this._geometry, event)
    this._fireEvent('mousemove', event)
  }

  /**
   * 双击事件处理
   * @param event
   * @private
   */
  _doubleClickHandler (event) {
    this.endDraw(event)
  }

  _getMouseContainerPoint (event) {
    const action = this._getRegisterMode()['action']
    if (action.indexOf('drag') > -1) {
      stopPropagation(event['domEvent'])
    }
    return event['containerPoint']
  }

  _isValidContainerPoint (containerPoint) {
    const mapSize = this._map.getSize()
    const w = mapSize['width']
    const h = mapSize['height']
    if (containerPoint.x < 0 || containerPoint.y < 0) {
      return false
    } else if (containerPoint.x > w || containerPoint.y > h) {
      return false
    }
    return true
  }

  /**
   * 清空缓存
   * @private
   */
  _clearStage () {
    this._getDrawLayer(this.layerName).clear()
    if (this._geometry) {
      this._geometry.remove()
      delete this._geometry
    }
    delete this._clickCoords
  }

  /**
   * 添加geometry到图层
   * @param geometry
   * @private
   */
  _addGeometryToStage (geometry) {
    this._getDrawLayer(this.layerName).addGeometry(geometry)
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
   * Get symbol of the draw tool
   * @return {Object} symbol
   */
  getSymbol () {
    const symbol = this.options['symbol']
    if (symbol) {
      return maptalks.Util.extendSymbol(symbol)
    } else {
      return maptalks.Util.extendSymbol(this.options['symbol'])
    }
  }

  /**
   * 创建矢量图层
   * @param layerName
   * @returns {*}
   * @private
   */
  _getDrawLayer (layerName) {
    let drawToolLayer = this._map.getLayer(layerName)
    if (!drawToolLayer) {
      drawToolLayer = new maptalks.VectorLayer(layerName, {
        'enableSimplify': false
      })
      this._map.addLayer(drawToolLayer)
    }
    return drawToolLayer
  }

  /**
   * fire event
   * @param eventName
   * @param param
   * @private
   */
  _fireEvent (eventName, param = {}) {
    if (this._geometry) {
      param['geometry'] = this._getRegisterMode()['generate'](this._geometry).copy()
    }
    maptalks.MapTool.prototype._fireEvent.call(this, eventName, param)
  }

  /**
   * when layer add, check register mode
   */
  onAdd () {
    this._getRegisterMode()
  }

  /**
   * handle enAble event
   * @returns {PlotDraw}
   */
  onEnable () {
    this._deactiveMapInteractions()
    this.drawLayer = this._getDrawLayer(this.layerName)
    this._clearStage()
    this._loadResources()
    return this
  }

  /**
   * handle disable event
   * @returns {PlotDraw}
   */
  onDisable () {
    const map = this.getMap()
    this._activateMapInteractions()
    this.endDraw()
    if (this._map) {
      map.removeLayer(this._getDrawLayer(this.layerName))
    }
    return this
  }

  /**
   * 结束当前绘制
   * @param param
   * @returns {PlotDraw}
   */
  endDraw (param = {}) {
    if (!this._geometry || this._ending) {
      return this
    }
    this._ending = true
    const geometry = this._geometry
    this._clearStage()
    this._geometry = geometry
    this._fireEvent('drawend', param)
    delete this._geometry
    if (this.options['once']) {
      this.disable()
    }
    delete this._ending
    return this
  }

  _loadResources () {
    const symbol = this.getSymbol()
    const resources = maptalks.Util.getExternalResources(symbol)
    if (resources.length > 0) {
      this.drawLayer._getRenderer().loadResources(resources)
    }
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
