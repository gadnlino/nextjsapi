
/**
 * get the name, id, and description of people who mention ufrj in the description
 */
function ufrjOnly(persons) {
    if(persons === null || persons == undefined) return [];

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

    let words = [["aluno","professor","pesquisador","aluna","professar"],
                 ["ufrj","universidade federal do rio de janeiro"]]


    let containsGroups = words.map(wordsGroup => ContainsOneOrMore(person.resumo,wordsGroup));

    return containsGroups.every(el => el === true)
}

/**
 * Checks if s contains at least one of the given words
 * @param {string} s 
 * @param {string[]} words
 */
function ContainsOneOrMore(s,words){
    return words.some(word => s.toLowerCase().indexOf(word) !== -1)
}

export default {
    ufrjOnly:ufrjOnly
}