const loadPost = require('../request/post_body');
const waveform = require('./main');

module.exports = function (req, res, url) {
	if (req.method != 'POST' || url.path != '/goapi/saveWaveform/') return;
	loadPost(req, res).then(data => {
		
		if (!data.body_zip) {
			res.statusCode = 400;
			res.end();
			return true;
		}

		const body = Buffer.from(data.body_zip, 'base64');
		
		try {
			const wId = waveform.save(body);
			res.end('0' + wId);
		} catch (e) {
			console.error(e);
		}
	});
	return true;
}
