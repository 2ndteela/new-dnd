import { readLocal, writeLocal, removeLocal } from './storage'

const characterString = 'character'

export const clearCurrentCharacter = () => {
    removeLocal(characterString)
}

export const writeCharacter = data => {
    data.savedChar = false
    writeLocal(characterString, data)
}

export const writeCharacterWithoutFlag = data => {
    writeLocal(characterString, data)
}

export const loadCharacter = () => {
    const char = readLocal(characterString)
    if(!char) return null
    if(!char.weapons) char.weapons = []
    if(!char.abilities) char.abilities = []
    return char
}

export const skillList = () => {
    return [
        {
            name: 'Acrobatics',
            field: 'acrobatics',
            base: 'Dex'
        },
        {
            name: 'Animal Handling',
            field: 'aniHand',
            base: 'Wis'
        },
        {
            name: 'Arcana',
            field: 'arcana',
            base: 'Int'
        },
        {
            name: 'Athletics',
            field: 'athletics',
            base: 'Str'
        },
        {
            name: 'Deception',
            field: 'deception',
            base: 'Chr'
        },
        {
            name: 'History',
            field: 'history',
            base: 'Int'
        },
        {
            name: 'Insight',
            field: 'insight',
            base: 'Wis'
        },
        {
            name: 'Initimidation',
            field: 'intim',
            base: 'Chr'
        },
        {
            name: 'Investigation',
            field: 'invest',
            base: 'Int'
        },
        {
            name: 'Medicine',
            field: 'med',
            base: 'Wis'
        },
        {
            name: 'Nature',
            field: 'nature',
            base: 'Int'
        },
        {
            name: 'Perception',
            field: 'perception',
            base: 'Wis'
        },
        {
            name: 'Performance',
            field: 'perform',
            base: 'Chr'
        },
        {
            name: 'Persuasion',
            field: 'persuasion',
            base: 'Chr'
        },
        {
            name: 'Religion',
            field: 'religion',
            base: 'Int'
        },
        {
            name: 'Slight of Hand',
            field: 'soh',
            base: 'Dex'
        },
        {
            name: 'Sealth',
            field: 'stealth',
            base: 'Dex'
        },
        {
            name: 'Survival',
            field: 'survival',
            base: 'Wis'
        }
    ]
}