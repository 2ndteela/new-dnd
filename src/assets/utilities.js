const characterString = 'character'

export const writeToLocalStorage = (path, data) => {
    localStorage[path] = JSON.stringify(data)
}

export const getFromLocalStorage = path => {
    try {
        return JSON.parse(localStorage[path])
    }
    catch (err) {
        return null
    }
}

export const removeFromLocalStorage = path => {
    localStorage.removeItem(path)
}

export const clearCurrentCharacter = () => {
    removeFromLocalStorage(characterString)
}

export const writeCharacter = data => {
    data.savedChar = false
    writeToLocalStorage(characterString, data)
}

export const writeCharacterWithoutFlag = data => {
    writeToLocalStorage(characterString, data)
}

export const loadCharacter = () => {
    const char = getFromLocalStorage(characterString)
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