import microsoftAcademicService from "../_services/microsoftAcademicService";

const handleRequest = async (req, res) => {
	if (req.method === 'GET') {
		if (!Object.keys(req.query).includes("searchValue")) {
			res
				.status(400)
				.json({ error: "Parâmetro obrigatório: searchValue" })
		}
		else {
			const response = await microsoftAcademicService
				.query(req.query.searchValue);

			res.status(200).json({
				response: response
			});
		}
	}
	else {
		res.status(405)
	}
}

export default handleRequest;