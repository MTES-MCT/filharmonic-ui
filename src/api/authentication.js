import * as util from '@/util'

const principal = {
  identifiant: 'alain.champion',
  nom: 'Alain Champion',
  profil: 'inspecteur',
  avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  isAuthenticated: false
}

export const requireAuth = async (to, from, next) => {
  if (!await isLoggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export const isLoggedIn = util.slow(() => {
  console.log('isLoggedIn=' + principal.isAuthenticated)
  return principal.isAuthenticated
})

export const login = util.slow((user, password) => {
  principal.isAuthenticated = true
  console.log('isLoggedIn=' + principal.isAuthenticated)
})

export const logout = util.slow(() => {
  principal.isAuthenticated = false
  console.log('isLoggedIn=' + principal.isAuthenticated)
})

export const getPrincipal = util.slow(() => {
  return principal
})
