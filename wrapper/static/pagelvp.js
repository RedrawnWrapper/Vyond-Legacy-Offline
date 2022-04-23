function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return;
	const query = url.query;

	var params, returnUrl, playerPath, html, videomakerPath;
	if (process.env.OFFLINE_SERVER == "Y") {
		returnUrl = "https://localhost:8043";
		playerPath = "player";
		videomakerPath = "themeChooser";
	} else {
		returnUrl = "https://josephanimate2021.github.io";
		playerPath = "lvm-static/offline-player";
		videomakerPath = "lvm-static/themeChooser?return=http://localhost:4343/";
	}
	switch (url.pathname) {
		case "/player": {
			params = {
				flashvars: {
					movieId: "",
				},
			};
			html = `<html>
	<head>
		<script>
			function genorateId() { 
				window.location = '${returnUrl}/${playerPath}?movieId=${params.flashvars.movieId}'; 
			}
		</script>
	</head>
	<body onload="genorateId()"></body>
</html>`;
			break;
		}
			
		case "/videomaker": {
			html = `<html>
	<head>
		<script>
			function genorateId() { 
				window.location = '${returnUrl}/${videomakerPath}'; 
			}
		</script>
	</head>
	<body onload="genorateId()"></body>
</html>`;
			break;
		}

		default:
			return;
	}
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(`${html}`)
	return true;
};
