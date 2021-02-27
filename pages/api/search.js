import crosssrefService from "./_services/crosssrefService";
import escavadorService from "./_services/escavadorService";
import orcidService from "./_services/orcidService";
import utils from "./_utils/utils";
import _personFilter from "./escavador/_personFilter"

const isNullOrUndefined = (value) => value === null || value === undefined;

const validateRequest = (req) => {

	const queryParams = req.query;

	const { apis, returnProps, searchTypes, searchValue } = queryParams;

	const errors = [];

	if (isNullOrUndefined(searchValue)) {
		errors.push('Digite um termo válido para a pesquisa');
	}
	else if (isNullOrUndefined(apis) || apis && apis.length === 0) {
		errors.push('Selecione uma API para busca');
	}
	else if (isNullOrUndefined(searchTypes) ||
		searchTypes && searchTypes.length === 0) {
		errors.push('Selecione um tipo de pesquisa');
	}
	else if (isNullOrUndefined(returnProps) ||
		returnProps && returnProps.length === 0) {
		errors.push('Selecione uma propriedade de retorno');
	}

	if (!isNullOrUndefined(apis)) {
		const apisInvalidas =
			(typeof apis === 'string'
				? [apis] : apis).filter(a => !Object.values(utils.APIS).includes(a));

		if (apisInvalidas.length > 0) {
			errors.push('Parâmetro inválido: apis(' + apisInvalidas.join(",") + ')');
		}
	}

	if (!isNullOrUndefined(searchTypes)) {
		const searchTypesInvalidas =
			(typeof searchTypes === 'string'
				? [searchTypes] : searchTypes)
				.filter(a => !Object.values(utils.SEARCH_TYPE).includes(a));

		if (searchTypesInvalidas.length > 0) {
			errors.push('Parâmetro inválido: searchTypes(' + searchTypesInvalidas.join(",") + ')');
		}
	}

	if (!isNullOrUndefined(returnProps)) {
		const returnPropsInvalidas =
			(typeof returnProps === 'string'
				? [returnProps] : returnProps)
				.filter(a => !Object.values(utils.RETURN_PROPS).includes(a));

		if (returnPropsInvalidas.length > 0) {
			errors.push('Parâmetro inválido: returnProps(' + returnPropsInvalidas.join(",") + ')');
		}
	}

	return errors;
}

export default async function handleRequest(req, res) {
	if (req.method === 'GET') {
		const queryParams = req.query;

		const { apis, returnProps, searchTypes, searchValue } = queryParams;

		const errors = validateRequest(req);

		if (errors.length > 0) {
			res.status(400).send(JSON.stringify({
				errors
			}));
		}
		else {
			let responses = [];

			try {

				if (apis.includes(utils.APIS.ESCAVADOR)) {

					const promiseEscavador = async () => {

						const response = await
							escavadorService.searchPessoa(searchValue);

						let items = _personFilter.ufrjOnly(response.items)

						console.log(items);

						let peopleWithProjects = [];

						for (let person of items) {

							try {
								const response = await escavadorService.getPersonData(person);
								peopleWithProjects.push(
									{
										...person,
										projetos: response.curriculo_lattes.projetos
									}
								)
							}
							catch {
								peopleWithProjects.push(
									{
										...person,
										projetos: null
									}
								)
							}

						}

						return peopleWithProjects;
					}

					responses.push({
						origin: utils.APIS.ESCAVADOR,
						response: await promiseEscavador()
					});
				}

				if (apis.includes(utils.APIS.CROSSREF)) {
					const promiseCrossref = async () => {
						const response = await crosssrefService
							.queryWorksByAuthor(req.query.searchValue);

						const controlObject = {
							"reference-count": true,
							"references-count": true,
							"institution": true,
							"created": true,
							"title": true,
							"author": true,
							"URL": true
						};

						const keywords =
							["UFRJ",
								"UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
								"CCMN",
								"CT-UFRJ",
								"CENTRO DE TECNOLOGIA UFRJ"];

						return response.message.items
							//.map(obj => utils.filterJavascriptObject(obj, controlObject))
							.filter(obj => {
								let has = false;

								const { author } = obj;

								author.forEach(a => {
									a.affiliation.forEach(aff => {
										if (keywords.includes(aff.name.toUpperCase())) {
											has = true;
										}
									})
								});

								return has;
							})
					}

					responses.push({
						origin: utils.APIS.CROSSREF,
						response: await promiseCrossref()
					});
				}

				if (apis.includes(utils.APIS.ORCID)) {
					responses.push({
						origin: utils.APIS.ORCID,
						response: await orcidService
							.orcid_query(req.query.searchValue)
					})
				}

				res.status(200).send(JSON.stringify(responses));
			}
			catch (e) {
				res.status(500)
					.send(JSON.stringify({
						errors: [e.message]
					}));
			}
		}
	}
	else {
		res.status(405)
	}
}