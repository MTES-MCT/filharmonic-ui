import { ApplicationError } from '@/errors'
import BaseAPI from './base'
import * as _ from '@/util'

const users = [
  {
    id: 1,
    name: 'Alain Champion',
    email: 'alain.champion@developpement-durable.gouv.fr',
    photoURL: 'https://randomuser.me/api/portraits/men/85.jpg',
    type: 'inspecteur',
    inspectionsFavorites: [1]
  },
  {
    id: 2,
    name: 'Corine Dupont',
    email: 'Corine.dupont@developpement-durable.gouv.fr',
    photoURL: 'https://randomuser.me/api/portraits/women/85.jpg',
    type: 'inspecteur',
    inspectionsFavorites: []
  },
  {
    id: 3,
    name: 'Albert Approbe',
    email: 'albert.approbe@developpement-durable.gouv.fr',
    photoURL: 'https://randomuser.me/api/portraits/men/86.jpg',
    type: 'approbateur',
    inspectionsFavorites: []
  },
  {
    id: 4,
    name: 'Michel Exploitant1',
    email: 'michel@exploitant1.fr',
    photoURL: 'https://randomuser.me/api/portraits/men/87.jpg',
    type: 'exploitant',
    inspectionsFavorites: []
  },
  {
    id: 5,
    name: 'Bernard Exploitant2',
    email: 'bernard@exploitant2.fr',
    photoURL: 'https://randomuser.me/api/portraits/men/88.jpg',
    type: 'exploitant',
    inspectionsFavorites: []
  }
]

export default class UsersAPI extends BaseAPI {
  async list (options = {}) {
    // non authentifié car utilisateurs listés en page de login
    let filteredUsers = _.cloneDeep(users)
    if (options.filter) {
      filteredUsers = filteredUsers.filter(options.filter)
    }
    return filteredUsers
  }
  async listInspecteurs (options) {
    return this.list({
      ...options,
      filter: user => user.type === 'inspecteur'
    })
  }
  async get (userId, options) {
    const user = (await this.list({
      ...options,
      filter: user => user.id === userId
    }))[0]
    if (!user) {
      throw new ApplicationError(`Utilisateur ${userId} non trouvé`)
    }
    return user
  }
  async toggleInspectionFavorite (inspectionId, favoris) {
    const user = users.find(user => user.id === this.api.store.state.authentication.user.id)
    const inspectionIndex = user.inspectionsFavorites.indexOf(inspectionId)
    if (favoris && inspectionIndex === -1) {
      user.inspectionsFavorites.push(inspectionId)
    } else if (!favoris && inspectionIndex !== -1) {
      user.inspectionsFavorites.splice(inspectionIndex, 1)
    }
  }
}
