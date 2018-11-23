export function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function slow (func, ms = 100) {
  return async (...args) => {
    await sleep(ms)
    return func(...args)
  }
}
