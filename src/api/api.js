import AuthenticationAPI from './authentication'
import EtablissementsAPI from './etablissements'
import EvenementsAPI from './evenements'
import InspectionsAPI from './inspections'
import ThemesAPI from './themes'
import UsersAPI from './users'

export default class API {
  constructor (options = {}) {
    this.authentication = new AuthenticationAPI({
      api: this
    })
    this.etablissements = new EtablissementsAPI({
      api: this
    })
    this.evenements = new EvenementsAPI({
      api: this
    })
    this.inspections = new InspectionsAPI({
      api: this
    })
    this.themes = new ThemesAPI({
      api: this
    })
    this.users = new UsersAPI({
      api: this
    })
  }
}
