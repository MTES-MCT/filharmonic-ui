import BaseAPI from './base'

const users = [
  {
    id: 1,
    name: 'Alain Champion',
    email: 'alain.champion@developpement-durable.gouv.fr',
    photoURL: 'https://randomuser.me/api/portraits/men/85.jpg',
    type: 'inspecteur'
  },
  {
    id: 2,
    name: 'Corine Dupont',
    email: 'Corine.dupont@developpement-durable.gouv.fr',
    photoURL: 'https://randomuser.me/api/portraits/women/85.jpg',
    type: 'inspecteur'
  },
  {
    id: 3,
    name: 'Albert Approbe',
    email: 'albert.approbe@developpement-durable.gouv.fr',
    photoURL: 'https://randomuser.me/api/portraits/men/86.jpg',
    type: 'approbateur'
  },
  {
    id: 4,
    name: 'Michel Exploitant1',
    email: 'michel@exploitant1.fr',
    photoURL: 'https://randomuser.me/api/portraits/men/87.jpg',
    type: 'exploitant'
  }
]

export default class UsersAPI extends BaseAPI {
  async list () {
    // non authentifié car utilisateurs listés en page de login
    return users
  }
  async listInspecteurs () {
    return users.filter(u => u.type === 'inspecteur')
  }
  async get (userId) {
    return users.find(user => user.id === userId)
  }
}
