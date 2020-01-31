export default class SessionStorageWrapper {
  static getValue(key, parse = false) {
    const value = sessionStorage.getItem(key)
    if (!parse || !value) return value

    return JSON.parse(value)
  }

  static setValue(key, value) {
    if (typeof value !== 'string')
      sessionStorage.setItem(key, JSON.stringify(value))
    else sessionStorage.setItem(key, value)
  }

  static clearValues(keys) {
    if (Array.isArray(keys)) keys.forEach(k => sessionStorage.removeItem(k))
    else sessionStorage.removeItem(keys)
  }

  static clearAll() {
    sessionStorage.clear()
  }
}
