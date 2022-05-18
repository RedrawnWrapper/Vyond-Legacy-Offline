const parse = require('../data/parse');
const fUtil = require('../fileUtil');
const nodezip = require('node-zip');
const fs = require('fs');

module.exports = {
	/**
	 *
	 * @param {Buffer} movieZip
	 * @param {string} nëwId
	 * @param {string} oldId
	 * @returns {Promise<string>}
	 */
	save(waveZip) {
		return new Promise((res, rej) => {
			const zip = nodezip.unzip(waveZip);
			var wId = fUtil.getNextFileId('waveform-', '.wf');
			let path = fUtil.getFileIndex('waveform-', '.wf', wId);
			let writeStream = fs.createWriteStream(path);
			parse.unpackZip(zip).then(data => {
				writeStream.write(data, () => {
					writeStream.close();
					res('0-' + wId);
				});
			});
                });
	},
}
