import escavadorService from "../_services/escavadorService";

import personFilter from "./_personFilter.js";
import fs, { readFileSync } from "fs";

const handleRequest = async (req, res) => {
	if (req.method === 'GET') {
		if (!Object.keys(req.query).includes("searchValue")) {
			res
			.status(400)
			.json({ error: "Parâmetro obrigatório: searchValue" })
		}
		else {
			const response = await escavadorService.searchPessoa(req.query.person);

			let items = personFilter.ufrjOnly(response.items)
		
			let peopleWithProjects = [];
			
			for(let person of items){
				try{
					const response = await escavadorService.getPersonData(person);
				    peopleWithProjects.push(
						{
							...person,
							projetos: response.curriculo_lattes.projetos
						}
					)
				}
				catch{
					peopleWithProjects.push(
						{
							...person,
							projetos: null
						}
					)
				}
                
			}
			
			res.status(200).json({
				response: peopleWithProjects
			});
		}
	}
	else {
		res.status(405)
	}
}

export default handleRequest;