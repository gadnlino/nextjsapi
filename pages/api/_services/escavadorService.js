const apiBaseUrl = process.env.ESCAVADOR_API_URL;

async function getAccessToken() {
	const url = new URL(apiBaseUrl + "/request-token");

	const username = process.env.ESCAVADOR_USERNAME;
	const password = process.env.ESCAVADOR_PASSWORD;

	const body = {
		"username": username,
		"password": password
	};

	const options = {
		method: "POST",
		headers: {
			"X-Requested-With": "XMLHttpRequest",
			"Content-Type": "application/json",
		},

		body: JSON.stringify(body)
	};

	const response =
		await fetch(url, options);

	return response;
}

export default {
	searchPessoa: async (query) => {
		const url = new URL(apiBaseUrl + "/busca");

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