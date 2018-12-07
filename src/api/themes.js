import * as util from '@/util'

const themes = [
  {
    id: 1,
    name: "Rejets dans l'eau"
  },
  {
    id: 2,
    name: "Rejets dans l'air"
  },
  {
    id: 3,
    name: 'Sûreté'
  },
  {
    id: 4,
    name: 'Produits chimiques'
  },
  {
    id: 5,
    name: 'Incendie'
  },
  {
    id: 6,
    name: 'COV'
  }
]

export const listThemes = util.slow(() => {
  return themes.map(theme => theme.name) // ids are not referenced in models but copied
})

export const createTheme = util.slow(theme => {
  theme.id = new Date().getTime() % 1000
  return themes.push(theme)
})

export const deleteTheme = util.slow(theme => {
  const index = themes.indexOf(theme)
  if (index !== -1) {
    this.themes.splice(index, 1)
  }
})
