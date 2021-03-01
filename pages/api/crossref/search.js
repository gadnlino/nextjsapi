import crosssrefService from "../_services/crosssrefService";
import utils from "../_utils/utils";

const handleRequest = async (req, res) => {

	if (req.method === 'GET') {
		if (!Object.keys(req.query).includes("searchValue")) {
			res
				.status(400)
				.json({ error: "Parâmetro obrigatório: searchValue" })
		}
		else {
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

			res.status(200).json({
				response: response.message.items
				//.map(obj => filterJavascriptObject(obj, controlObject))
				.filter(obj => {
					let has = false;

					const { author } = obj;

					author.forEach(a=>{
						a.affiliation.forEach(aff=>{
							if(keywords.includes(aff.name.toUpperCase())){
								has = true;
							}
						})
					});

					return has;
				})
			});
		}
	}
	else {
		res.status(405)
	}
}

export default handleRequest;