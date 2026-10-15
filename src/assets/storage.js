import localforage from 'localforage'
import { useSyncExternalStore } from 'react'

// IndexedDB-backed store with a synchronous in-memory mirror.
// `initStorage()` must finish before the app renders; after that reads are instant
// and writes update the mirror immediately and persist in the background.

const store = localforage.createInstance({ name: 'dee-n-dee', storeName: 'app' })
const cache = new Map()
const listeners = new Set()

// Keys the app used to keep in window.localStorage (as JSON strings)
const LEGACY_KEYS = ['uid', 'character', 'tempCharacter']

function notify() {
  listeners.forEach((listener) => listener())
}

export async function initStorage() {
  try {
    await store.iterate((value, key) => {
      cache.set(key, value)
    })

    // One-time move from localStorage
    for (const key of LEGACY_KEYS) {
      const legacy = window.localStorage.getItem(key)
      if (legacy === null) continue
      if (!cache.has(key)) {
        try {
          const parsed = JSON.parse(legacy)
          cache.set(key, parsed)
          await store.setItem(key, parsed)
        }
        catch (err) {
          console.error(`Could not migrate ${key}`, err)
        }
      }
      window.localStorage.removeItem(key)
    }
  }
  catch (err) {
    // Storage unavailable (e.g. private mode); the app still runs from memory
    console.error('Local storage unavailable', err)
  }
}

// Copies in and out, like the old JSON localStorage, so callers can mutate what they read
const clone = (value) => (value === null || typeof value !== 'object' ? value : structuredClone(value))

export function readLocal(key) {
  return cache.has(key) ? clone(cache.get(key)) : null
}

export function writeLocal(key, value) {
  value = clone(value)
  cache.set(key, value)
  notify()
  return store.setItem(key, value).catch((err) => console.error(`Could not save ${key}`, err))
}

export function removeLocal(key) {
  cache.delete(key)
  notify()
  return store.removeItem(key).catch((err) => console.error(`Could not remove ${key}`, err))
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Re-renders when the key changes. Returns the cached value itself (stable snapshot); don't mutate it.
export function useLocalValue(key) {
  return useSyncExternalStore(subscribe, () => (cache.has(key) ? cache.get(key) : null))
}

// Session: signed in (uid) or guest. Synced data is namespaced so guest data never mixes with an account's.
export const isSignedIn = () => !!readLocal('uid')
export const isGuest = () => !isSignedIn() && readLocal('guest') === true
export const hasSession = () => isSignedIn() || isGuest()
export const dataKey = (collection) => `data/${readLocal('uid') || 'guest'}/${collection}`

// A new guest session shows the device-only banner again
export function startGuestSession() {
  removeLocal('uid')
  removeLocal('guestBannerDismissed')
  writeLocal('guest', true)
}

// Signed out and not a guest: the app sends you to the login page
export function endSession() {
  removeLocal('uid')
  removeLocal('guest')
}

export function startSignedInSession(uid) {
  removeLocal('guest')
  writeLocal('uid', uid)
}
