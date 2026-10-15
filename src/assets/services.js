import { getDatabase, child, ref, get, set, push, remove, update } from "firebase/database";
import { loadCharacter, writeCharacterWithoutFlag, clearCurrentCharacter } from "./utilities";
import { readLocal, writeLocal, removeLocal, isSignedIn, dataKey, startSignedInSession, endSession } from "./storage";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";

// Every write goes to local storage (IndexedDB). Signed-in users also write to Firebase,
// and their reads come from Firebase, falling back to the local copy when offline.

const userPath = (collection) => `users/${readLocal('uid')}/${collection}`

const localId = () => `local-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`

// Firebase generates push ids client-side, so this works offline too
const newKey = (collection) => (isSignedIn() ? push(ref(getDatabase(), userPath(collection))).key : localId())

function writeLocalItem(collection, key, value) {
    const items = readLocal(dataKey(collection)) || {}
    items[key] = value
    writeLocal(dataKey(collection), items)
}

function removeLocalItem(collection, key) {
    const items = readLocal(dataKey(collection)) || {}
    delete items[key]
    writeLocal(dataKey(collection), items)
}

// Returns { [key]: item }. A successful remote read refreshes the local copy.
async function readCollection(collection) {
    const local = () => readLocal(dataKey(collection)) || {}
    if (!isSignedIn()) return local()

    try {
        const snapshot = await get(child(ref(getDatabase()), userPath(collection)))
        const items = snapshot.exists() ? snapshot.val() : {}
        writeLocal(dataKey(collection), items)
        return items
    }
    catch (err) {
        console.error(`Could not reach the database, using the local copy of ${collection}`, err)
        return local()
    }
}

// Remote writes don't block: offline, Firebase holds them until it reconnects
const logRemoteError = (err) => console.error('Database write failed', err)

export const getCharacters = async () => {
    return { characters: await readCollection('characters') }
}

export const writeCharacterToDb = async () => {
    const data = loadCharacter()
    if (!data || data.savedChar) return

    // Keep the key on the character so later saves update it instead of adding a copy
    if (!data.key) data.key = newKey('characters')
    data.savedChar = true

    writeLocalItem('characters', data.key, data)
    if (isSignedIn()) set(ref(getDatabase(), `${userPath('characters')}/${data.key}`), data).catch(logRemoteError)

    writeCharacterWithoutFlag(data)
}

export const getEncounters = async () => readCollection('encounters')

export const createEncounter = async (encounter) => {
    const key = newKey('encounters')
    writeLocalItem('encounters', key, encounter)
    if (isSignedIn()) set(ref(getDatabase(), `${userPath('encounters')}/${key}`), encounter).catch(logRemoteError)
    return key
}

// Resolves once the remote write lands (callers don't wait on it) so failures can be reported
export const saveEncounter = async (key, encounter) => {
    writeLocalItem('encounters', key, encounter)
    if (isSignedIn()) await set(ref(getDatabase(), `${userPath('encounters')}/${key}`), encounter)
}

export const deleteEncounter = async (key) => {
    removeLocalItem('encounters', key)
    if (isSignedIn()) remove(ref(getDatabase(), `${userPath('encounters')}/${key}`)).catch(logRemoteError)
}

const SYNCED_COLLECTIONS = ['characters', 'encounters']

// Copies anything made in guest mode into the account that just signed in.
// One multi-path update adds the items without touching existing account data.
// Guest data is only cleared once the upload succeeds, so a failure retries next sign-in.
async function moveGuestDataToAccount(uid) {
    const updates = {}
    SYNCED_COLLECTIONS.forEach((collection) => {
        const items = readLocal(`data/guest/${collection}`) || {}
        Object.entries(items).forEach(([key, item]) => {
            updates[`${collection}/${key}`] = item
        })
    })

    if (Object.keys(updates).length < 1) return

    try {
        await update(ref(getDatabase(), `users/${uid}`), updates)

        SYNCED_COLLECTIONS.forEach((collection) => {
            const guestItems = readLocal(`data/guest/${collection}`) || {}
            const accountItems = readLocal(`data/${uid}/${collection}`) || {}
            writeLocal(`data/${uid}/${collection}`, { ...accountItems, ...guestItems })
            removeLocal(`data/guest/${collection}`)
        })
    }
    catch (err) {
        console.error('Could not move guest data to the account; it stays on this device', err)
    }
}

async function startAccountSession(uid) {
    startSignedInSession(uid)
    await moveGuestDataToAccount(uid)
}

export const signInUser = async (email, password) => {
    try {
        const auth = getAuth()
        const credentials = await signInWithEmailAndPassword(auth, email, password)

        await startAccountSession(credentials.user.uid)
        return credentials.user
    }
    catch (err) {
        if (err.message.includes('wrong-password') || err.message.includes('user-not-found'))
            throw (new Error('Bad Login Credentials'))

        else throw err
    }
}

export const createNewUser = async (email, password) => {
    try {
        const auth = getAuth()
        const credentials = await createUserWithEmailAndPassword(auth, email, password)

        await startAccountSession(credentials.user.uid)
        return credentials.user
    }
    catch (err) {
        throw err
    }
}

// Signs out of Firebase (if signed in) and ends the session. Locally stored data is kept,
// so signing back in on this device starts from the cached copy.
export const signOutUser = async () => {
    if (readLocal('uid')) {
        try {
            await signOut(getAuth())
        }
        catch (err) {
            console.error('Firebase sign out failed; ending the local session anyway', err)
        }
    }

    clearCurrentCharacter()
    endSession()
}

export const sendForgotPasswordEmail = async (email) => {
    const auth = getAuth();
    try {
        await sendPasswordResetEmail(auth, email)
        return 200
    }
    catch (error) {
        throw error
    }
}

export const searchForSpell = async spell => {
    try {
        const resp = await fetch(`https://www.dnd5eapi.co/api/spells/${spell}`)
        const data = await resp.json()
        return data
    }
    catch (error) {
        console.error('error is', error)
        return null
    }
}

export const getAllSpells = async () => {
    try {
        const resp = await fetch("https://www.dnd5eapi.co/api/spells")
        const data = await resp.json()
        return data
    }
    catch (error) {
        console.error(error)
    }
}

export const searchForWeapon = async weapon => {
    try {
        const resp = await fetch(`https://www.dnd5eapi.co/api/equipment/${weapon}`)
        const data = await resp.json()

        if (!data.error)
            return data

        const magicItem = await fetch(`https://www.dnd5eapi.co/api/magic-items/${weapon}`)
        const magicData = await magicItem.json()
        magicData.isMagic = true

        if (!magicData.error)
            return magicData

        return null
    }
    catch (error) {
        console.error(error)
        return null
    }
}

export const getAllWeapons = async () => {
    try {
        const resp = await fetch("https://www.dnd5eapi.co/api/equipment-categories/weapon")
        const data = await resp.json()
        return data
    }
    catch (error) {
        console.error(error)
    }
}

export const getAllClasses = async () => {
    try {
        const resp = await fetch('https://www.dnd5eapi.co/api/classes')
        const data = await resp.json()
        return data.results
    }
    catch (error) {
        console.error(error)
    }
}

export const getFromDnd5eApi = async (endpoint) => {
    try {
        const resp = await fetch(`https://www.dnd5eapi.co/api/2014${endpoint}`)
        const data = await resp.json()
        return data
    }
    catch (error) {
        console.error(error)
    }
}

export const getMonsterFromIndex = async (index) => {
    try {
        const resp = await fetch(`https://www.dnd5eapi.co/api/2014/monsters/${index}`)
        const data = await resp.json()
        return data
    }
    catch (error) {
        console.error(error)
    }
}