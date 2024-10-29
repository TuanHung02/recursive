// eventBus.js
import { reactive } from 'vue'

export const eventBus = reactive({})
export function emitEvent(event, payload) {
  if (!eventBus[event]) eventBus[event] = []
  eventBus[event].forEach(callback => callback(payload))
}
export function onEvent(event, callback) {
  if (!eventBus[event]) eventBus[event] = []
  eventBus[event].push(callback)
}
export function offEvent(event, callback) {
  eventBus[event] = eventBus[event].filter(cb => cb !== callback)
}
