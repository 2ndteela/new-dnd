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
    return getFromLocalStorage(characterString)
}

export const skillList = () => {
    return [
        {
            name: 'Acrobatics',
            field: 'acrobatics'
        },
        {
            name: 'Animal Handling',
            field: 'aniHand'
        },
        {
            name: 'Arcana',
            field: 'arcana'
        },
        {
            name: 'Athletics',
            field: 'athletics'
        },
        {
            name: 'Deception',
            field: 'deception'
        },
        {
            name: 'History',
            field: 'history'
        },
        {
            name: 'Insight',
            field: 'insight'
        },
        {
            name: 'Initimidation',
            field: 'intim'
        },
        {
            name: 'Medicine',
            field: 'med'
        },
        {
            name: 'Nature',
            field: 'nature'
        },
        {
            name: 'Perception',
            field: 'perception'
        },
        {
            name: 'Performance',
            field: 'perform'
        },
        {
            name: 'Persuasion',
            field: 'persuasion'
        },
        {
            name: 'Religion',
            field: 'religion'
        },
        {
            name: 'Slight of Hand',
            field: 'soh'
        },
        {
            name: 'Sealth',
            field: 'stealth'
        },
        {
            name: 'Survival',
            field: 'survival'
        }
    ]
}