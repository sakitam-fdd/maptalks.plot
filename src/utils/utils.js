/**
 * 判断是否为对象
 * @param value
 * @returns {boolean}
 */
export const isObject = value => {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

export const merge = (a, b) => {
  for (const key in b) {
    if (isObject(b[key]) && isObject(a[key])) {
      merge(a[key], b[key])
    } else {
      a[key] = b[key]
    }
  }
  return a
}
