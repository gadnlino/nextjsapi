import axios from "axios";

const apiBaseUrl = process.env.MICROSOFT_ACADEMIC_API_URL;

export default {
	query: async (query) => {
		
		let params = {
			"expr": `Composite(AA.AuN='${query}')`,
			"subscription-key":
				process.env.MICROSOFT_ACADEMIC_API_SUBSCRIPTION_KEY,
		};

		const res = await axios.get(apiBaseUrl + "/evaluate", { params });

		return res.data;
	}
}