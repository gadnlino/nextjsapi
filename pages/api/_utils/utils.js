export function filterJavascriptObject(data, control) {
	var controlKeys = Object.keys(control),
		results = controlKeys.reduce(function (v, key) {
			if (control[key] === true && data.hasOwnProperty(key)) {
				v[key] = data[key];
			}

			return v;
		}, {});

	controlKeys.filter(function (key) {
		return typeof control[key] === 'object' && control[key] !== null && !Array.isArray(control[key]) && typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key]);
	}).forEach(function (key) {
		results[key] = filterObj(data[key], control[key]);
	});

	return results;
}