const apiBaseUrl = process.env.GOOGLE_SCHOLAR_API_URL;

export default {
	query: async (query) => {
		const url = new URL(apiBaseUrl + "/evaluate");

		let params = {
			"q": query,
			"qo": "p",
		};

		Object.keys(params).forEach(key =>
			url.searchParams.append(key, params[key]));

		const accessTokenResponse = await (await getAccessToken()).json();

		const accessToken = await 
			accessTokenResponse["access_token"];

		let headers = {
			"Authorization": `Bearer ${accessToken}`,
			"X-Requested-With": "XMLHttpRequest",
			"Accept": "application/json",
			"Content-Type": "application/json",
		}

		const response = await fetch(url, {
			method: "GET",
			headers: headers,
		});

		return await response.json();
	}
}