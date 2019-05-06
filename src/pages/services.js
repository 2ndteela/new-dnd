export const readInCharacter = () => {
    const data = JSON.parse(localStorage['tempCharacter'])

    let abils = []
    for(let a in data.abilities) {
        abils.push(data.abilities[a])
    }
    data.abilities = abils

    if(!data.currentHealth) data.currentHealth = data.health
    if(!data.tempHealth) data.tempHealth = 0

    return data
}