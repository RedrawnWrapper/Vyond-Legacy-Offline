const loadPost = require('../request/post_body');
const starter = require('./main');

module.exports = function (req, res, url) {
	if (req.method != 'POST' || url.path != '/goapi/saveTemplate/') return;
	loadPost(req, res).then(data => {
		
		if (!data.body_zip || data.thumbnail_large) {
			res.statusCode = 400;
			res.end();
			return true;
		}

		const body = Buffer.from(data.body_zip, 'base64');
		const thumb = Buffer.from(data.thumbnail_large, 'base64');
		
		try {
			const sId = starter.save(body, thumb);
			res.end('0' + sId);
		} catch (e) {
			console.error(e);
	});
	return true;
}
