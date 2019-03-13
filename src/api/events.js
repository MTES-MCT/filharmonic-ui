import events from '@/events.js'

export default class EventsManager {
  constructor (devMode = false) {
    this.devMode = devMode
    this.bus = events.bus
    this.pendingEvents = []
    this.polling = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.pendingEvents.forEach(event => {
          this.ws.send(JSON.stringify(event))
        })
        this.pendingEvents = []
      }
    }, 1000)
  }
  async init () {
    this.ws = new WebSocket((location.protocol === 'https:' ? 'wss' : 'ws') + '://' + location.host + '/api/ws')
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve
      this.ws.onerror = reject
    })
    this.ws.onmessage = event => {
      this.onMessage(JSON.parse(event.data))
    }
    return this
  }
  onMessage (event) {
    if (this.devMode) {
      console.log(`new event ${event.type}:`, event.payload) // eslint-disable-line no-console
    }
    this.bus.$emit(event.type, event.payload)
  }
  sendEvent (eventType, payload) {
    this.pendingEvents.push({
      type: eventType,
      payload: payload
    })
  }
  subscribe (resource, id) {
    this.sendEvent('subscribe', {
      resource: resource,
      resource_id: id
    })
  }
  unsubscribe (resource, id) {
    this.sendEvent('unsubscribe', {
      resource: resource,
      resource_id: id
    })
  }
  connect (userId) {
    this.sendEvent('connect', {
      user_id: userId
    })
  }
  disconnect () {
    this.sendEvent('disconnect', {})
  }
}
