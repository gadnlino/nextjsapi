
/**
 * get the name, id, and description of people who mention ufrj in the description
 */
function ufrjOnly(persons) {
    if(!persons) return [];
    let PersonsImportantData = persons.map(p => getEssentialData(p))

    return PersonsImportantData.filter(p => mentionUfrj(p))
}

function getEssentialData(person) {
    return {
        nome: person.nome,
        id: person.id,
        resumo: person.resumo,
    }
}

function mentionUfrj(person) {

    let words = [
        "ufrj",
        "universidade federal do rio de janeiro",
    ]

    for (let word of words) {
        if (person.resumo.toLowerCase().indexOf(word) !== -1) {
            return true;
        }
    }


    return false;
}


export default {
    ufrjOnly:ufrjOnly
}