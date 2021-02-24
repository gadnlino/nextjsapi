import microsoftAcademicService from "../_services/microsoftAcademicService";

const handleRequest = async (req, res) => {
	if (req.method === 'GET') {
		if (!Object.keys(req.query).includes("person")) {
			res
				.status(400)
				.json({ error: "Parâmetro obrigatório: person" })
		}
		else {
			const response = await microsoftAcademicService
				.query(req.query.person);

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