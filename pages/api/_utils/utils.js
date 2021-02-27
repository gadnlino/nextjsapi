export default {
	APIS: {
		ESCAVADOR: "ESCAVADOR",
		//MICROSOFT_ACADEMIC: "MICROSOFT_ACADEMIC",
		//GOOGLE_SCHOLAR: "GOOGLE_SCHOLAR",
		CROSSREF: "CROSSREF",
		ORCID: "ORCID"
	},
	SEARCH_TYPE: {
		PESSOA: 'PESSOA',
		PROJETO_PESQUISA_EXTENSAO: "PROJETO_PESQUISA_EXTENSAO"
	},
	RETURN_PROPS: {
		INSTITUICAO: "INSTITUICAO",
		AUTORES: "AUTORES",
		DATA_PUBLICACAO: "DATA_PUBLICACAO",
		LINK_PESQUISA: "LINK_PESQUISA",
		PUBLISHER: "PUBLISHER",
		REFERENCIAS: "REFERENCIAS"
	},
	filterJavascriptObject: (data, control) => {
		var controlKeys = Object.keys(control),
			results = controlKeys.reduce(function (v, key) {
				if (control[key] === true && data.hasOwnProperty(key)) {
					v[key] = data[key];
				}

				return v;
			}, {});

		controlKeys.filter(function (key) {
			return typeof control[key] === 'object' && control[key] !== null && !Array.isArray(control[key]) && typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key]);
		}).forEach(function (key) {
			results[key] = filterObj(data[key], control[key]);
		});

		return results;
	}
}