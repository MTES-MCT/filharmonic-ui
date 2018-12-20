import { ApplicationError } from '@/errors'
import BaseAPI from './base'
import * as _ from '@/util'

const notifications = [
  {
    id: 1,
    created_at: new Date('2018-11-16T16:50:00'),
    lue: false,
    userId: 2,
    evenementId: 8
  },
  {
    id: 2,
    created_at: new Date('2018-11-16T17:10:00'),
    lue: false,
    userId: 2,
    evenementId: 9
  }
]

export default class NotificationsAPI extends BaseAPI {
  async list (options = {}) {
    let filteredNotifications = _.cloneDeep(notifications.filter(notification => notification.userId === this.api.store.state.authentication.user.id))

    if (options.filter) {
      filteredNotifications = filteredNotifications.filter(options.filter)
    }

    return Promise.all(
      filteredNotifications
        .map(async notification => {
          notification.evenement = await this.api.evenements.get(notification.evenementId, {
            auteur: true
          })
          return notification
        })
        .reverse()
    )
  }

  async listNonLues (options = {}) {
    return this.list({
      ...options,
      filter: notification => !notification.lue
    })
  }

  async create (notification) {
    notification.id = notifications[notifications.length - 1].id + 1
    notification.created_at = new Date()
    notification.lue = false
    notifications.push(_.cloneDeep(notification))
  }

  async marquerCommeLue (notificationId) {
    const notification = notifications.find(notification => notification.id === notificationId)
    if (!notification) {
      throw new ApplicationError(`Notification ${notificationId} non trouvée`)
    }
    notification.lue = true
  }

  async marquerCommeLues (notificationsIds) {
    notificationsIds.forEach(notificationId => this.marquerCommeLue(notificationId))
  }
}
