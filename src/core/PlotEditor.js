import * as maptalks from 'maptalks'

const Class = maptalks.Class
const EventAble = maptalks.Eventable

class PlotEditor extends EventAble(Class) {
  constructor (geometry, opts) {
    super(opts)
    this._geometry = geometry
  }

  /**
   * 激活符号编辑
   * @param plot
   */
  activate (plot) {
    this._geometry = plot
    console.log(plot, this)
    this.fire('editStart', {
      geometry: this._geometry
    })
  }

  /**
   * 取消激活工具
   */
  deactivate () {
    console.log(this)
  }
}

export default PlotEditor
