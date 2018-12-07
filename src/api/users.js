import * as util from '@/util'

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

export const listUsers = util.slow(() => {
  return users
})

export const listInspecteurs = util.slow(() => {
  return users.filter(u => u.type === 'inspecteur')
})

export const getUser = util.slow((id) => {
  return users.find(user => user.id === id)
})
