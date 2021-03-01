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

		let { apis, returnProps, searchTypes, searchValue } = queryParams;

		apis = typeof apis === 'string' ?
			[apis] : apis;

		returnProps = typeof returnProps === 'string' ?
			[returnProps] : returnProps;

		searchTypes = typeof searchTypes === 'string' ?
			[searchTypes] : searchTypes;

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

						let items = _personFilter.ufrjOnly(response.items);

						let peopleWithProjects = [];

						for (let person of items) {
							try {
								const response =
									await escavadorService.getPersonData(person);

								peopleWithProjects.push(
									{
										...utils.filterJavascriptObject(
											{ ...person },
											{
												"nome": true,
												"id": false,
												"resumo": true
											}),

										projetos:
											response.curriculo_lattes.projetos
												.map(obj =>
													utils.filterJavascriptObject(obj, {
														"id": false,
														"descricao": true,
														"ano_inicio":
															returnProps.includes(utils.RETURN_PROPS.DATA_PUBLICACAO),
														"ano_fim":
															returnProps.includes(utils.RETURN_PROPS.DATA_PUBLICACAO),
														"lattes_id": true
													}))
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
							"indexed": false,
							"reference-count": false,
							"publisher":
								returnProps.includes(utils.RETURN_PROPS.PUBLISHER),
							"issue": false,
							"content-domain": false,
							"short-container-title": false,
							"published-print": returnProps.includes(utils.RETURN_PROPS.DATA_PUBLICACAO),
							"abstract": true,
							"DOI": false,
							"type": false,
							"created": returnProps.includes(utils.RETURN_PROPS.DATA_PUBLICACAO),
							"page": false,
							"source": false,
							"is-referenced-by-count": false,
							"title": true,
							"prefix": false,
							"volume": false,
							"author": returnProps.includes(utils.RETURN_PROPS.AUTORES),
							"member": false,
							"reference": returnProps.includes(utils.RETURN_PROPS.REFERENCIAS),
							"container-title": false,
							"link": returnProps.includes(utils.RETURN_PROPS.LINK_PESQUISA),
							"deposited": false,
							"score": false,
							"issued": returnProps.includes(utils.RETURN_PROPS.DATA_PUBLICACAO),
							"references-count": false,
							"journal-issue": false,
							"alternative-id": false,
							"URL": returnProps.includes(utils.RETURN_PROPS.LINK_PESQUISA),
							"relation": false,
							"ISSN": false,
							"issn-type": false,
							"subject": false
						};

						const keywords =
							["UFRJ",
								"UNIVERSIDADE FEDERAL DO RIO DE JANEIRO",
								"CCMN",
								"CT-UFRJ",
								"CENTRO DE TECNOLOGIA UFRJ"];

						return response.message.items
							.filter(obj => {
								let has = false;

								const { author } = obj;

								if (!isNullOrUndefined(author)) {
									author.forEach(a => {
										a.affiliation.forEach(aff => {
											if (keywords.includes(aff.name.toUpperCase())) {
												has = true;
											}
										})
									});
								}

								return has;
							})
							.map(obj => utils.filterJavascriptObject(obj, controlObject));
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