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
				"title":true,
				"author": true,
				"URL": true
			};

			res.status(200).json({
				response: {
					origin: "escavador",
					data: response.message.items
						.map(obj => filterJavascriptObject(obj, controlObject))
				}
			});
		}
	}
	else {
		res.status(405)
	}
}

export default handleRequest;