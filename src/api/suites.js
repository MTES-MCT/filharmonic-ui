import BaseAPI from '@/api/base'
import * as _ from '@/util'
import { ApplicationError } from '@/errors'
import { Suite } from '@/models/suite'

const suites = [
  {
    id: 1,
    inspectionId: 2,
    type: 'observation',
    synthese: 'Réduire la croissance des émissions de NOx'
  }
]

export default class SuitesAPI extends BaseAPI {
  async list (options = {}) {
    let filtered = _.cloneDeep(suites)
    if (options.filter) {
      filtered = filtered.filter(options.filter)
    }
    return Promise.all(
      filtered.map(async suite => {
        return _.cloneDeep(suite)
      })
    )
  }
  async get (id, options) {
    const suite = (await this.list({
      ...options,
      filter: suite => suite.id === id
    }))[0]
    if (!suite) {
      throw new ApplicationError(`Suite ${id} non trouvée`)
    }
    return suite
  }
  async listByInspection (inspectionId, options) {
    return this.list({
      ...options,
      filter: suite => suite.inspectionId === inspectionId
    })
  }
  async save (newSuite) {
    this.requireInspecteur()
    const newId = new Date().getTime() % 1000
    const suite = new Suite()
    Object.assign(suite, newSuite)
    suite.id = newId
    suites.push(suite)
    return suite
  }
}
