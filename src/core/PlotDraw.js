/**
 * Created by FDD on 2017/12/10.
 * @desc PlotDraw
 */

import * as maptalks from 'maptalks'
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
