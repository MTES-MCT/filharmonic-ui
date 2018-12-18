import AuthenticationAPI from '@/api/authentication'
import EtablissementsAPI from '@/api/etablissements'
import EvenementsAPI from '@/api/evenements'
import InspectionsAPI from '@/api/inspections'
import LettresAPI from '@/api/lettres'
import ThemesAPI from '@/api/themes'
import UsersAPI from '@/api/users'

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
    this.lettres = new LettresAPI({
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
