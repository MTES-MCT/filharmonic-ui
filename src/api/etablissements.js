/** Mock api server side */

import * as util from '@/util'

const etablissements = [{
  id: '0999.00001',
  nom: 'EtablissementA',
  raison: 'EtablissementA SARL',
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00002',
  nom: 'EtablissementB',
  raison: 'EtablissementB SARL',
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00003',
  nom: 'EtablissementC',
  raison: 'EtablissementC SARL',
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00004',
  nom: 'EtablissementD',
  raison: 'EtablissementD SARL',
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00005',
  nom: 'EtablissementE',
  raison: 'EtablissementE SARL',
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00006',
  nom: 'EtablissementF',
  raison: 'EtablissementF SARL',
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
}]

export const listAllEtablissements = util.slow(() => {
  return etablissements
})

export const getEtablissement = util.slow((id) => {
  return etablissements.find(etablissement => etablissement.id === id)
})
