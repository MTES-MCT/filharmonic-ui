export function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function slow (func, ms = 100) {
  return async (...args) => {
    await sleep(ms)
    return func(...args)
  }
}

export function cloneDeep (source) {
  const objectType = typeof source
  if (objectType === 'string' || objectType === 'number' || objectType === 'boolean' || objectType === null || objectType === undefined) {
    return source
  } else if (source instanceof Array) {
    return source.map(cloneDeep)
  } else if (source instanceof Date) {
    return new Date(source.getTime())
  } else if (objectType === 'object') {
    return Object.keys(source)
      .reduce(function (clone, key) {
        clone[key] = cloneDeep(source[key])
        return clone
      }, {})
  } else {
    throw new Error(`unknown object type: ${objectType}`)
  }
}

export function normalize (string) {
  return string == null ? '' : string.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function debounce (func, wait) {
  let lastThis
  let lastArgs
  let timerId
  function wrapper (...args) {
    lastThis = this
    lastArgs = args
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(invoke, wait)
  }
  function invoke () {
    timerId = null
    func.apply(lastThis, lastArgs)
  }
  return wrapper
}
