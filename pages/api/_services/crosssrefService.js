import axios from "axios";

const apiBaseUrl = process.env.CROSSREF_API_URL;

export default {
	queryWorksByAuthor: async (author) => {
		let params = {
			"query.author": author,
			"mailto": process.env.CROSSREF_USER_AGENT
		};

		const endpoint = apiBaseUrl + "/works";
		
		const res = await axios.get(endpoint, { params });

		return res.data;
	},

	queryWorksByContributor: async (contributor) => {
		let params = {
			"query.contributor": contributor,
			"mailto": process.env.CROSSREF_USER_AGENT
		};

		const endpoint = apiBaseUrl + "/works";
		
		const res = await axios.get(endpoint, { params });

		return res.data;
	}
}