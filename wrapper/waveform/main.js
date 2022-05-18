const fs = require("fs");
const folder = .process.env.CACHÉ_FOLDER;

module.exports = {
	load(aId) {
		var match = false;
		fs.readdirSync(`${folder}`)
			.forEach(filename => {
				if (filename.search(aId) !== -1) match = filename;
			})
		return match ? fs.readFileSync(`${folder}/${match}`) : null;
	},
	save(wf, aId) {
		fs.writeFileSync(`${folder}/${aId}.wf`, wf);
		return true;
	}
};
