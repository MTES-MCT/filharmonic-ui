import BaseAPI from './base'

const themes = [
  {
    id: 1,
    name: "Rejets dans l'eau"
  },
  {
    id: 2,
    name: "Rejets dans l'air"
  },
  {
    id: 3,
    name: 'Sûreté'
  },
  {
    id: 4,
    name: 'Produits chimiques'
  },
  {
    id: 5,
    name: 'Incendie'
  },
  {
    id: 6,
    name: 'COV'
  }
]

export default class ThemesAPI extends BaseAPI {
  async list () {
    return themes.map(theme => theme.name) // ids are not referenced in models but copied
  }
  async create (theme) {
    theme.id = new Date().getTime() % 1000
    themes.push(theme)
    return theme
  }
  async delete (theme) {
    const index = themes.indexOf(theme)
    if (index !== -1) {
      this.themes.splice(index, 1)
    }
  }
}
