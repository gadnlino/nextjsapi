import escavadorService from "../_services/escavadorService";

const handleRequest = async (req, res) => {
	if (req.method === 'GET') {
		if (!Object.keys(req.query).includes("person")) {
			res
				.status(400)
				.json({ error: "Parâmetro obrigatório: person" })
		}
		else {
			const response = await
				escavadorService.searchPessoa(req.query.person);

			console.log(response);

			res.status(response.status).json({
				response: response.status === 200 ? 
					await response.json() : null,
				error: response.status !== 200 ? 
					await response.json() : null,
			});
		}
	}
	else {
		res.status(405)
	}
}

export default handleRequest;