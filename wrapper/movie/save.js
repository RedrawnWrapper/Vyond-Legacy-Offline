const movie = require('./main');

module.exports = function (req, res, url) {
	if (req.method != 'POST' || url.path != '/goapi/saveMovie/') return;
	else if (!req.body.body_zip) {
		res.statusCode = 400;
		res.end();
		return true;
	}
	const trigAutosave = req.body.is_triggered_by_autosave;
		if (trigAutosave && !req.body.movieId) return res.end('0');

		var body = Buffer.from(req.body.body_zip, 'base64');
		var thumb = trigAutosave ? null : Buffer.from(req.body.thumbnail_large, 'base64');
		movie.save(body, thumb, req.body.movieId || req.body.presaveId, req.body.presaveId).then(nId => res.end('0' + nId));
	});
	return true;
}
