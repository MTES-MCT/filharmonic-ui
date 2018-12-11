/*
ApplicationError correspond aux erreurs connues de l'application.
Si non attapré, ce type d'erreur est affiché via une popup toaster.
*/
export class ApplicationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ApplicationError'
  }
}
