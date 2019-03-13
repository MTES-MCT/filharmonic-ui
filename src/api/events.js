import events from '@/events.js'

export default class EventsManager {
  constructor (userId) {
    this.bus = events.bus
    this.ws = new WebSocket('ws://' + location.host + '/api/ws')
    this.ws.onopen = () => {
      console.log('connecting WS')
      this.sendEvent('connect', {
        user_id: userId
      })
    }
    this.ws.onmessage = event => {
      this.onMessage(JSON.parse(event.data))
    }
    this.pendingEvents = []
    this.polling = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.pendingEvents.forEach((event) => {
          this.ws.send(JSON.stringify(event))
        })
        this.pendingEvents = []
      }
    }, 1000)
  }
  onMessage (event) {
    console.log(`new event ${event.type}:`, event.payload)
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
  disconnect () {
    console.log('disconnecting WS')
    this.sendEvent('disconnect', {})
    // clearInterval(this.polling)
    // this.ws.close()
  }
}
