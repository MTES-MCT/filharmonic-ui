import { ApplicationError } from '@/errors'
import BaseAPI from './base'
import * as _ from '@/util'

const etablissements = [{
  id: '0999.00001',
  nom: 'EtablissementA',
  raison: 'EtablissementA SARL',
  responsables: [4],
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00002',
  nom: 'EtablissementB',
  raison: 'EtablissementB SARL',
  responsables: [5],
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00003',
  nom: 'EtablissementC',
  raison: 'EtablissementC SARL',
  responsables: [5],
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00004',
  nom: 'EtablissementD',
  raison: 'EtablissementD SARL',
  responsables: [5],
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00005',
  nom: 'EtablissementE',
  raison: 'EtablissementE SARL',
  responsables: [5],
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00006',
  nom: 'EtablissementF',
  raison: 'EtablissementF SARL',
  responsables: [5],
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
}]

export default class EtablissementsAPI extends BaseAPI {
  async list (options = {}) {
    let filteredEtablissements = _.cloneDeep(etablissements)
    if (this.api.store.getters.isExploitant) {
      filteredEtablissements = filteredEtablissements.filter(etablissement => etablissement.responsables.includes(this.api.store.state.authentication.user.id))
    }
    if (options.filter) {
      filteredEtablissements = filteredEtablissements.filter(options.filter)
    }
    return Promise.all(
      filteredEtablissements.map(async etablissement => {
        if (options.inspections) {
          etablissement.inspections = await this.api.inspections.listByEtablissement(etablissement.id)
        }
        return etablissement
      })
    )
  }
  async get (etablissementId, options) {
    const etablissement = (await this.list({
      ...options,
      filter: etablissement => etablissement.id === etablissementId
    }))[0]
    if (!etablissement) {
      throw new ApplicationError(`Etablissement ${etablissementId} non trouvé`)
    }
    return etablissement
  }
}
