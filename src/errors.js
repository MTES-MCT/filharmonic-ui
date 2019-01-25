/*
ApplicationError correspond aux erreurs connues de l'application.
Si non attrapé, ce type d'erreur est affiché via une popup toaster.
*/
export class ApplicationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ApplicationError'
  }
}

export class ForbiddenError extends ApplicationError {
  constructor (message) {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class UnknownServerError extends ApplicationError {
  constructor (message) {
    super(message)
    this.name = 'UnknownServerError'
  }
}
