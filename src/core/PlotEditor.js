import * as maptalks from 'maptalks'
import { isNumber } from '../utils'
import {BASE_HELP_CONTROL_POINT_ID, EDITOR_LAYERNAME} from '../Constants'
const Class = maptalks.Class
const EventAble = maptalks.Eventable

const key = '_plot_editor';

class PlotEditor extends EventAble(Class) {
  constructor (geometry, opts) {
    super(opts)

    /**
     * geometry
     */
    this._geometry = geometry

    /**
     * map pan
     * @type {boolean}
     */
    this.mapDragPan = true

    /**
     * 存放控制点
     * @type {Array}
     */
    this.controlPoints = []

    /**
     * is dragging
     * @type {boolean}
     */
    this.isDragging = false

    /**
     * 创建图层名称
     * @type {string}
     */
    this.layerName = ((opts && opts['layerName']) ? opts['layerName'] : EDITOR_LAYERNAME)
  }

  /**
   * 激活符号编辑
   * @param plot
   */
  activate (plot) {
    this.deactivate()
    this._geometry = plot
    this.initControlPoints()
    this.fire('editStart', {
      geometry: this._geometry
    })
    return this
  }

  /**
   * 取消激活工具
   */
  deactivate () {
    this.removeControlPoints()
    delete this._geometry
    this.controlPoints = []
  }

  initControlPoints () {
    this.controlPoints = []
    let controlPoints = PlotEditor.getControlPoints(this._geometry)
    if (controlPoints && Array.isArray(controlPoints) && controlPoints.length > 0) {
      if (controlPoints.length > this.options['limitControlPoints'] &&
        this.options.hasOwnProperty('limitControlPoints') &&
        this.options['limitControlPoints'] > 2) {
        // TODO 这里其中 `limitControlPoints` 必须包含起止点，所以这里处理了一下
        const _n = Math.floor(controlPoints.length / (this.options['limitControlPoints'] - 2)) || 1
        for (let i = 0; i < this.options['limitControlPoints'] - 2; i++) {
          const _index = (i + 1) * _n - 1
          this._addControlPoint(controlPoints, _index)
        }
        this._addControlPoint(controlPoints, 0)
        this._addControlPoint(controlPoints, controlPoints.length - 1)
      } else {
        for (let i = 0; i < controlPoints.length; i++) {
          this._addControlPoint(controlPoints, i)
        }
      }
    }
  }

  /**
   * remove control points
   */
  removeControlPoints () {
    const _layer = this._getDrawLayer(this.layerName)
    for (let i = 0; i < this.controlPoints.length; i++) {
      if (this.controlPoints[i]) {
        _layer.removeGeometry(this.controlPoints[i])
      }
    }
  }

  /**
   * 添加控制点
   * @param points
   * @param _index
   * @private
   */
  _addControlPoint (points, _index) {
    const id = BASE_HELP_CONTROL_POINT_ID + '-' + _index
    const _marker = new maptalks.Marker(
      points[_index],
      {
        id: id,
        draggable: true,
        symbol: {
          'markerType': 'ellipse',
          'markerFill': '#ffffff',
          'markerFillOpacity': 1,
          'markerLineColor': '#000',
          'markerLineWidth': 1,
          'markerLineOpacity': 1,
          'markerLineDasharray': [],
          'markerWidth': 10,
          'markerHeight': 10,
          'markerDx': 0,
          'markerDy': 0,
          'markerOpacity': 0.6
        },
        properties: {
          index: _index
        }
      }
    )
    if (this.getMap()) {
      _marker.addTo(this._getDrawLayer(this.layerName))
      _marker.on('dragstart', this._handleDragStart, this)
      _marker.on('dragging', this._handleDragging, this)
      _marker.on('dragend', this._handleDragEnd, this)
    }
    this.controlPoints.push(_marker)
  }

  /**
   * handle drag start
   * @param event
   * @private
   */
  _handleDragStart (event) {
    this.isDragging = true
  }

  /**
   * handle dragging
   * @param event
   * @private
   */
  _handleDragging (event) {
    this._handleGeometryChange(event)
  }

  /**
   * handle drag end
   * @param event
   * @private
   */
  _handleDragEnd (event) {
    this._handleGeometryChange(event)
    this.isDragging = false
  }

  /**
   * handle geometry change
   * @param event
   * @private
   */
  _handleGeometryChange (event) {
    if (this.isDragging && event.target) {
      const _index = event.target.getProperties() && event.target.getProperties()['index']
      const sourcePoints = this._geometry.getPoints()
      if (isNumber(_index) && sourcePoints.length > _index) {
        sourcePoints[_index] = event.coordinate
        this._geometry.setPoints(sourcePoints)
      }
    }
  }

  /**
   * 创建矢量图层
   * @param layerName
   * @returns {*}
   * @private
   */
  _getDrawLayer (layerName) {
    const _map = this.getMap()
    if (!_map) return
    let drawToolLayer = _map.getLayer(layerName)
    if (!drawToolLayer) {
      drawToolLayer = new maptalks.VectorLayer(layerName, {
        'enableSimplify': false
      })
      _map.addLayer(drawToolLayer)
    }
    return drawToolLayer
  }

  /**
   * add plot editor to map
   * @param map
   * @returns {PlotEditor}
   */
  addTo (map) {
    if (!map) {
      return this;
    }
    this._map = map;
    if (map[key]) {
      map[key].disable();
    }
    if (this.onAdd) {
      this.onAdd();
    }
    this.enable();
    map[key] = this;
    this.fire('add');
    return this;
  }

  /**
   * Gets the map it added to.
   * @return {Map} map
   */
  getMap () {
    return this._map;
  }

  /**
   * enable plot editor
   * @returns {PlotEditor}
   */
  enable () {
    const map = this._map;
    if (!map || this._enabled) {
      return this;
    }
    this._enabled = true;
    if (this.onEnable) {
      this.onEnable();
    }
    this.fire('enable');
    return this;
  }

  /**
   * disable plot editor
   * @returns {PlotEditor}
   */
  disable () {
    if (!this._enabled || !this._map) {
      return this;
    }
    this._enabled = false;
    if (this.onDisable) {
      this.onDisable();
    }
    this.fire('disable');
    return this;
  }

  /**
   * check is enable
   * @returns {boolean}
   */
  isEnabled () {
    if (!this._enabled) {
      return false;
    }
    return true;
  }

  /**
   * remove from map
   * @returns {PlotEditor}
   */
  remove () {
    if (!this._map) {
      return this;
    }
    this.disable();
    if (this._map) {
      delete this._map[key];
      delete this._map;
    }
    this.fire('remove');
    return this;
  }

  /**
   * 激活地图的拖拽平移
   */
  enableMapDragPan () {
    const _map = this.getMap()
    if (!_map) return
    _map.config({
      'draggable': this.mapDragPan
    })
  }

  /**
   * 禁止地图的拖拽平移
   */
  disableMapDragPan () {
    const _map = this.getMap()
    if (!_map) return
    this.mapDragPan = _map.options['draggable']
    _map.config({
      'draggable': false
    })
  }

  /**
   * 获取要素的控制点
   * @returns {Array}
   */
  static getControlPoints (plot) {
    let points = []
    if (plot) {
      points = plot.getPoints()
    }
    return points
  }
}

export default PlotEditor
