import crosssrefService from "../_services/crosssrefService";
import { filterJavascriptObject } from "../_utils/utils";

const handleRequest = async (req, res) => {
	if (req.method === 'GET') {
		if (!Object.keys(req.query).includes("person")) {
			res
				.status(400)
				.json({ error: "Parâmetro obrigatório: person" })
		}
		else {
			const response = await crosssrefService
				.queryWorksByAuthor(req.query.person);

			const controlObject = {
				"reference-count": true,
				"references-count": true,
				"institution": true,
				"created": true,
				"title": true,
				"author": true,
				"URL": true
			};

			const affilitations = 
				["UFRJ","UNIVERSIDADE FEDERAL DO RIO DE JANEIRO", "CCMN"];

			res.status(200).json({
				response: {
					origin: "escavador",
					data: response.message.items
						.map(obj => filterJavascriptObject(obj, controlObject))
						.filter(obj => {
							let has = false;

							const { author } = obj;

							author.forEach(a=>{
								a.affiliation.forEach(aff=>{
									if(affilitations.includes(aff.name.toUpperCase())){
										has = true;
									}
								})
							});

							return has;
						})
				}
			});
		}
	}
	else {
		res.status(405)
	}
}

export default handleRequest;