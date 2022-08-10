import { getDatabase, child, ref, get, set, push } from "firebase/database";
import { getFromLocalStorage, loadCharacter, writeCharacterWithoutFlag, writeToLocalStorage } from "./utilities";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export const getCharacters = async () => {
    try {
        const dbRef = ref(getDatabase())
        const uid = getFromLocalStorage('uid')
        const chars = await get(child(dbRef, `users/${uid}`))

        if(chars.exists()) {
            return chars.val()
        }

        return null
    }
    catch(err) {
        console.error(err)
        return null
    }
}

export const writeCharacterToDb = async () => {
    try {
        const data = loadCharacter()
        if(!data?.savedChar) {
            const db = getDatabase()
            const userId = getFromLocalStorage('uid')
            data.savedChar = true

            if(!data.key)
                await push(ref(db, `users/${userId}/characters`), data)
            else
                await set(ref(db, `users/${userId}/characters/${data.key}`), data)

            writeCharacterWithoutFlag(data)
        }
    }
    catch(err) {
        throw err
    }
}

export const signInUser = async (email, password) => {
    try {
        const auth = getAuth()
        const credentials = await signInWithEmailAndPassword(auth, email, password)
        
        writeToLocalStorage('uid', credentials.user.uid)
        return credentials.user
    }
    catch(err) {
        if(err.message.includes('wrong-password') || err.message.includes('user-not-found'))
            throw(new Error('Bad Login Credentials'))

        else throw err
    }
}

export const createNewUser = async (email, password) => {
    try {
        const auth = getAuth()
        const credentials = await createUserWithEmailAndPassword(auth, email, password)

        writeToLocalStorage('uid', credentials.user.uid)
        return credentials.user
    }
    catch(err) {
        throw err
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
    catch(error) {
        console.error(error)
    }
}

export const searchForWeapon = async weapon => {
    try {
        const resp = await fetch(`https://www.dnd5eapi.co/api/equipment/${weapon}`)
        const data = await resp.json()

        if(!data.error)
            return data

        const magicItem = await fetch(`https://www.dnd5eapi.co/api/magic-items/${weapon}`)
        const magicData = await magicItem.json()
        magicData.isMagic = true

        if(!magicData.error)
            return magicData

        return null
    }
    catch(error) {

        

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
    catch(error) {

    }
}