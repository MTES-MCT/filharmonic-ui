import BaseAPI from './base'
import * as _ from '@/util'

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
    return _.cloneDeep(themes)
  }
  async listNames () {
    return themes.map(theme => theme.name) // ids are not referenced in models but copied
  }
  async create (nomTheme) {
    this.requireInspecteur()
    const theme = {
      id: new Date().getTime() % 1000,
      name: nomTheme
    }
    themes.push(theme)
    return theme
  }
  async delete (themeId) {
    this.requireApprobateur()
    const index = themes.map(theme => theme.id).indexOf(themeId)
    if (index !== -1) {
      themes.splice(index, 1)
    }
  }
}
