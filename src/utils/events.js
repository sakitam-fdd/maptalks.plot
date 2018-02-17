import { stamp } from './utils'

/**
 * 获取事件唯一标识
 * @param type
 * @param fn
 * @param context
 * @returns {string}
 */
const getDomEventKey = (type, fn, context) => {
  return '_dom_event_' + type + '_' + stamp(fn) + (context ? '_' + stamp(context) : '')
}

/**
 * 对DOM对象添加事件监听
 * @param element
 * @param type
 * @param fn
 * @param context
 * @param isOnce
 * @returns {*}
 */
const addListener = function (element, type, fn, context, isOnce) {
  let eventKey = getDomEventKey(type, fn, context)
  let handler = element[eventKey]
  if (handler) {
    if (!isOnce) {
      handler.callOnce = false
    }
    return this
  }
  handler = function (e) {
    return fn.call(context || element, e)
  }
  if ('addEventListener' in element) {
    element.addEventListener(type, handler, false)
  } else if ('attachEvent' in element) {
    element.attachEvent('on' + type, handler)
  }
  element[eventKey] = handler
  return this
}

const on = addListener

/**
 * 移除DOM对象监听事件
 * @param element
 * @param type
 * @param fn
 * @param context
 * @returns {removeListener}
 */
const removeListener = function (element, type, fn, context) {
  let eventKey = getDomEventKey(type, fn, context)
  let handler = element[eventKey]
  if (!handler) {
    return this
  }
  if ('removeEventListener' in element) {
    element.removeEventListener(type, handler, false)
  } else if ('detachEvent' in element) {
    element.detachEvent('on' + type, handler)
  }
  element[eventKey] = null
  return this
}

const off = removeListener

/**
 * attach events once
 * @param element
 * @param type
 * @param fn
 * @param context
 * @returns {*}
 */
const once = function (element, type, fn, context) {
  return addListener(element, type, fn, context, true)
}

/**
 * Prevent default behavior of the browser.
 * @param event
 * @returns {preventDefault}
 */
const preventDefault = function (event) {
  if (event.preventDefault) {
    event.preventDefault()
  } else {
    event.returnValue = false
  }
  return this
}

/**
 * Stop browser event propagation
 * @param event
 * @returns {stopPropagation}
 */
const stopPropagation = function (event) {
  if (event.stopPropagation) {
    event.stopPropagation()
  } else {
    event.cancelBubble = true
  }
  return this
}

/**
 * Prevents other listeners of the same event from being called.
 * @param event
 */
const stopImmediatePropagation = function (event) {
  event.stopImmediatePropagation()
}

export {
  on,
  once,
  addListener,
  off,
  removeListener,
  preventDefault,
  stopPropagation,
  stopImmediatePropagation
}
