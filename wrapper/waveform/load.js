const waveform = require('./main');

module.exports = function (url) {
	switch (url.path) {
		case '/goapi/getWaveForm/': { 
			waveform.load(); 
			break; 
		}
		default: return;
	}
}
