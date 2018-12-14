export class Theme {
  constructor ({ id = 0, name = '' } = {}) {
    this.id = id
    this.name = name
  }
}

export function createTheme (data) {
  return Object.freeze(new Theme(data))
}
