const fUtil = require('../fileUtil');
const stuff = require('./info');

function toAttrString(table) {
	return typeof (table) == 'object' ? Object.keys(table).filter(key => table[key] !== null).map(key =>
		`${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`).join('&') : table.replace(/"/g, "\\\"");
}
function toParamString(table) {
	return Object.keys(table).map(key =>
		`<param name="${key}" value="${toAttrString(table[key])}">`
	).join(' ');
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs).map(key =>
		`${key}="${attrs[key].replace(/"/g, "\\\"")}"`
	).join(' ')}>${toParamString(params)}</object>`;
}

module.exports = function (req, res, url) {
	if (req.method != 'GET') return;
	const query = url.query;

	var params, server, redirectUrl;
	
	switch (url.pathname) {
		case '/player': {
			params = {
				flashvars: {
					'movieId': '',
				},
			};
			break;
		}

		default:
			return;
	}
	if (process.env.OFFLINE_SERVER == "Y") {
		redirectUrl = `https://localhost:8043/player?movieId=${params.flashvars.movieId}`;
	} else {
		server = "https://josephanimate2021.github.io";
		redirectUrl = `${server}/lvm-static/offline-player?movieId=${params.flashvars.movieId}`;
	}
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	res.end(`<html><head><script>function Redirect(){window.location="${redirectUrl}";}</script><body onload="Redirect()"></body></html>`);
	return true;
}
