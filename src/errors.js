/*
ApplicationError correspond aux erreurs connues de l'application.
Si non attrapé, ce type d'erreur est affiché via une popup toaster.
*/
export class ApplicationError extends Error {
  constructor (options) {
    super(options.message)
    this.name = 'ApplicationError'
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor (options) {
    super(options)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends ApplicationError {
  constructor (options) {
    super(options)
    this.name = 'ForbiddenError'
  }
}

export class UnknownServerError extends ApplicationError {
  constructor (options) {
    super(options)
    this.name = 'UnknownServerError'
  }
}
