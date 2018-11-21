/** Mock api server side */

const _etablissements = [{
  id: '0999.00001',
  nom: 'Etablissement A',
  adresse: '123 rue de Paris'
},
{
  id: '0999.00002',
  nom: 'Etablissement B',
  adresse: '123 rue de Paris'
},
{
  id: '0999.00003',
  nom: 'Etablissement C',
  adresse: '123 rue de Paris'
},
{
  id: '0999.00004',
  nom: 'Etablissement D',
  adresse: '123 rue de Paris'
},
{
  id: '0999.00005',
  nom: 'Etablissement E',
  adresse: '123 rue de Paris'
},
{
  id: '0999.00006',
  nom: 'Etablissement F',
  adresse: '123 rue de Paris'
}]

export default {
  getAllEtablissements (cb) {
    setTimeout(() => cb(_etablissements), 100)
  },
  getEtablissement (cb, id) {
    setTimeout(() => cb(_etablissements.find(etablissement => etablissement.id === id), 100))
  }
}
