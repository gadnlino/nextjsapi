const apiBaseUrl = process.env.ORCID_API_URL;
const baseAccessTokenUrl = process.env.ORCID_TOKEN_URL;

async function getAccessToken() {
	const url = new URL(baseAccessTokenUrl + "/token");

	const client_id = process.env.ORCID_CLIENT_ID;
	const client_secret = process.env.ORCID_SECRET;

	const data = {
		"client_id": client_id,
    "client_secret": client_secret,
    "grant_type": "client_credentials",
    "scope": "/authenticate",
		"code": "LslmJz"
	};

	const options = {
		method: "POST",
		header: "Accept: application/json",

		data: JSON.stringify(data)
	};

	const response =
		await fetch(url, options);

	console.log(response)

	return response;
}

export default {
	orcid_query: async (query) => {
		// const url = new URL(apiBaseUrl + "/v3.0/search");

		// let params = {
		// 	"q": query,
		// };

		// Object.keys(params).forEach(key =>
		// 	url.searchParams.append(key, params[key]));

		// const accessTokenResponse = await (await getAccessToken()).json();

		// const accessToken = await 
		// 	accessTokenResponse["access_token"];

		// let headers = {
		// 	"Method": "GET",
		// 	"Content-type": "application/vnd.orcid+json",
		// 	"Authorization type": 'Bearer', 
		// 	"Access token": `${accessToken}`

		// }

		// const response = await fetch(url, {
		// 	method: "GET",
		// 	headers: headers,
		// });

		// return await response.json();
		return (await getAccessToken()).json();
	}
}