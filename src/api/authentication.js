import * as util from '@/util'

const principal = {
  identifiant: 'alain.champion',
  nom: 'Alain Champion',
  profil: 'inspecteur',
  avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  isAuthenticated: false
}

export const requireAuth = util.slow((to, from, next) => {
  if (!isLoggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export const isLoggedIn = util.slow(() => {
  return principal.isAuthenticated
})

export const login = util.slow((user, password) => {
  principal.isAuthenticated = true
})

export const logout = util.slow(() => {
  principal.isAuthenticated = false
})

export const getPrincipal = util.slow(() => {
  return principal
})
