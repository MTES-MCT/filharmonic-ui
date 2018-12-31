import AuthenticationAPI from '@/api/authentication'
import EtablissementsAPI from '@/api/etablissements'
import EvenementsAPI from '@/api/evenements'
import InspectionsAPI from '@/api/inspections'
import LettresAPI from '@/api/lettres'
import ThemesAPI from '@/api/themes'
import UsersAPI from '@/api/users'
import EchangesAPI from '@/api/echanges'
import MessagesAPI from '@/api/messages'
import ConstatsAPI from '@/api/constats'
import SuitesAPI from '@/api/suites'

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
    this.echanges = new EchangesAPI({
      api: this
    })
    this.constats = new ConstatsAPI({
      api: this
    })
    this.suites = new SuitesAPI({
      api: this
    })
    this.messages = new MessagesAPI({
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
