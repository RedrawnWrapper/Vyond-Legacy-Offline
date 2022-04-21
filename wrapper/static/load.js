const stuff = require('./info');
const fs = require('fs');

module.exports = function (req, res, url) {
	const methodLinks = stuff[req.method];
	for (let linkIndex in methodLinks) {
		var regex = new RegExp(linkIndex);
		if (regex.test(url.path)) {
			const t = methodLinks[linkIndex];
			const link = t.regexLink ? url.path.replace(
				regex, t.regexLink) : (t.link || url.path);
			const headers = t.headers;
			var content;

			try {
				for (var headerName in headers || {})
					res.setHeader(headerName, headers[headerName]);
				res.statusCode = t.statusCode || 200;
				if (t.content !== undefined) res.end(t.content);
				else fs.createReadStream(`./${link}`).pipe(res),
					content = fs.readFileSync(path, "utf8");
				if (process.env.OFFLINE_SERVER == "Y") {
					content = content.replace(/REQUEST_LINK/g, 'https://localhost:8043/player');
					content = content.replace(/VIDEOMAKER_LINK/g, 'https://localhost:8043/themeChooser');
				} else {
					content = content.replace(/REQUEST_LINK/g, 'https://josephanimate2021.github.io/lvm-static/offline-player');
					content = content.replace(/VIDEOMAKER_LINK/g, 'https://josephanimate2021.github.io/lvm-static/themeChooser?return=http://localhost:4343/');
				}
				res.end(content);
			}
			catch (e) {
				res.statusCode = t.statusCode || 404, res.end();
			}
			return true;
		}
	}
	return false;
}
