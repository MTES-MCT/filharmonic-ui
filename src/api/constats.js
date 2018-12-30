import BaseAPI from '@/api/base'
import * as _ from '@/util'
import { ApplicationError } from '@/errors'
import { typesConstat, createConstat } from '@/models/constat'

const constats = [
  {
    id: 1,
    echangeId: 2,
    type: 'conforme',
    remarques: '',
    echeance: ''
  },
  {
    id: 2,
    echangeId: 3,
    type: 'observation',
    remarques: 'Les rejets X2 sont contrôlés semestriellement pour les MES, la DBO5, la DCO, le pH, les hydrocarbures totaux. Les HAP ont été contrôlés dans le cadre de la campagne RSDE.',
    echeance: ''
  },
  {
    id: 3,
    echangeId: 4,
    type: 'non_conforme',
    remarques: 'Au jour de l\'inspection, les données 2018 n\'ont pas été télétransmises par l\'exploitant pour les données des rejets en eau + légionnelle. L\'inspection rappelle l\'obligation réglementaire faite à l\'exploitant de produire toute pièce ou documents mentionnés dans les différents arrêtés dans les délais prescrits. Les moyens humains et matériels correspondants doivent être mis en place pour que ces données puissent être disponibles pour l\'IIC.',
    echeance: '2019-05-17'
  },
  {
    id: 4,
    echangeId: 5,
    type: 'proposition_mise_en_demeure',
    remarques: 'Il faut réparer la fissure de la cuve.',
    echeance: '2019-02-17'
  }
]

export default class ConstatsAPI extends BaseAPI {
  async list (options = {}) {
    let filtered = _.cloneDeep(constats)
    if (options.filter) {
      filtered = filtered.filter(options.filter)
    }
    return Promise.all(
      filtered.map(async constat => {
        constat.type = typesConstat.find(t => t.id === constat.type)
        return _.cloneDeep(constat)
      })
    )
  }
  async get (id, options) {
    const constat = (await this.list({
      ...options,
      filter: constat => constat.id === id
    }))[0]
    if (!constat) {
      throw new ApplicationError(`Constat ${id} non trouvé`)
    }
    return constat
  }
  async getByEchange (echangeId, options) {
    return this.list({
      ...options,
      filter: constat => constat.echangeId === echangeId
    })
  }
  async save (newConstat) {
    this.requireInspecteur()
    const newId = new Date().getTime() % 1000
    const constat = createConstat({
      id: newId,
      type: newConstat.type,
      echangeId: newConstat.echangeId,
      remarques: newConstat.remarques,
      echeance: newConstat.echeance
    })
    constats.push(constat)
    return constat
  }
}
