const starter = require('./main');

module.exports = function (req, res, url) {
	switch (url.path) {
		case '/goapi/deleteUserTemplate/': { 
			starter.delete(); 
			starter.deleteThumb();
			break; 
		}
		default: return;
	}
}
