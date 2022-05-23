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