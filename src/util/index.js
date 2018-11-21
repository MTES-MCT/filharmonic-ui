export function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function slow (func, ms) {
  return async (...args) => {
    await sleep(ms)
    return func(...args)
  }
}
