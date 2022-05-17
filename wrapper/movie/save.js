const loadPost = require('../request/post_body');
const movie = require('./main');

module.exports = function (req, res, url) {
	if (req.method != 'POST' || url.path != '/goapi/saveMovie/') return;
	loadPost(req, res).then(data => {
		
		if (!data.body_zip) {
			res.statusCode = 400;
			res.end();
			return true;
		}

		const trigAutosave = data.is_triggered_by_autosave;
		if (trigAutosave && !data.movieId) { 
			return res.end('0'); 
		}

		var body = Buffer.from(data.body_zip, 'base64');
		var thumb = trigAutosave ? null : Buffer.from(data.thumbnail_large, 'base64');
		movie.save(body, thumb, data.movieId || data.presaveId, data.presaveId).then(nId => res.end('0' + nId));
	});
	return true;
}
