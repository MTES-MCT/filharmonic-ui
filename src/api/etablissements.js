/** Mock api server side */

import * as util from '@/util'

const etablissements = [{
  id: '0999.00001',
  nom: 'A',
  raison: 'A SARL',
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00002',
  nom: 'B',
  raison: 'B SARL',
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00003',
  nom: 'C',
  raison: 'C SARL',
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00004',
  nom: 'D',
  raison: 'D SARL',
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00005',
  nom: 'E',
  raison: 'E SARL',
  activite: 'Fabrication de matrices composites',
  adresse: '123 rue de Paris',
  seveso: 'haut',
  iedmtd: false
},
{
  id: '0999.00006',
  nom: 'F',
  raison: 'F SARL',
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
