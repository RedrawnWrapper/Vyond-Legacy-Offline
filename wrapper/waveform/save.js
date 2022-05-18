const loadPost = require("../request/post_body");
const asset = require("../asset/main");
const http = require("http");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) {
		case "/goapi/saveWaveForm/":
			loadPost(req, res).then(([data, wId]) => {
				var bytes = Buffer.from(data.bytes, "base64");
				asset.save(bytes, wId, "waveform", "wf");
			});
			return true;
	}
};
