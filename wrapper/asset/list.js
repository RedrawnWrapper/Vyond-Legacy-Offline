const loadPost = require('../request/post_body');
const header = process.env.XML_HEADER;
const fUtil = require('../fileUtil');
const nodezip = require('node-zip');
const base = Buffer.alloc(1, 0);
const asset = require('./main');
const starter = require('../starter/main');

async function listAssets(data, makeZip) {
	var xmlString, files;
	switch (data.type) {
		case 'char': {
			const chars = await asset.chars(data.themeId);
			xmlString = `${header}<ugc more="0">${chars.map(v => `<char id="${v.id}" name="Untitled" cc_theme_id="${
				v.theme}" thumbnail_url="char_default.png" copyable="Y"><tags/></char>`).join('')}</ugc>`;
			break;
		}
		case 'bg': {
			files = asset.getBackgrounds();
			xmlString = `${header}<ugc more="0">${files.map(v => `<bg id="${v.id}"/>`)}</ugc>`;
			break;
		}
		case 'movie': {
			files = starter.list()
			xmlString = `${header}<ugc more="0">${files.map(v =>`
			<movie id="${v.id}" path="/_SAVED/${
				v.id}" numScene="1" title="${v.name}" thumbnail_url="/starter_thumbs/${
					v.id}.png"><tags></tags></movie>`).join('')}</ugc>`;
			break;
		}
		case 'prop': {
			files = asset.getProps();
			xmlString = `${header}<ugc more="0">${files.map(v => `<prop subtype="0" id="${v.id}" asset_url="/api_v2/assets/${v.id}"/>`)}</ugc>`;
			break;
		}
		default: { // No File Type? Send in a blank response.
			xmlString = `${header}<ugc more="0"></ugc>`;
			break;
		}
	};

	if (makeZip) {
		const zip = nodezip.create();
		fUtil.addToZip(zip, 'desc.xml', Buffer.from(xmlString));

		switch (data.type) {
			case 'bg': {
				for (let c = 0; c < files.length; c++) {
					const file = files[c];
					fUtil.addToZip(zip, `bg/${file.id}`, asset.loadLocal(file.id));
				}
				break;
			}
		};
		return Buffer.concat([base, await zip.zip()]);
	}
	else
		return Buffer.from(xmlString);
}

async function listTeamAssets(data) {
	var response, files;
	switch (data.type) {
		case "char": {
			var themeId;
			switch (data.themeId) { // fix theme id
				case "custom": {
					themeId = "family";
					break;
				}
				case "action": {
					themeId = "cc2";
					break;
				}
				default: {
					themeId = data.themeId;
					break;
				}
			}
			files = await asset.chars(data.themeId);
			response = `${header}<ugc more="0">${files
				.map(v => `<char id="${v.id}" enc_asset_id="${v.id}" name="Untitled" cc_theme_id="${v.theme}" thumbnail_url="/char_thumbs/${v.id}.png" copyable="Y"><tags></tags></char>`)
				.join("")}</ugc>`;
			break;
		}
		case "bg": {
			files = asset.getBackgrounds();
			response = `${header}<ugc more="0">${files
				.map(v => `<background subtype="0" id="${v.id}" enc_asset_id="${v.id}" name="Untitled" enable="Y"/>`)
				.join("")}</ugc>`;
			break;
		}
		case "movie": {
			files = starter.list();
			response = `${header}<ugc more="0">${files
				.map(v => `<movie id="${v.id}" enc_asset_id="${v.id}" path="/_SAVED/${v.id}" numScene="1" title="${v.title}" thumbnail_url="/starter_thumbs/${v.id}.png"><tags></tags></movie>`)
				.join("")}</ugc>`;
			break;
		}
		case "prop": {
			files = asset.getProps();
			response = `${header}<ugc more="0">${files
				.map(v => `<prop subtype="video" id="${v.id}" enc_asset_id="${v.id}" name="Untitled" enable="Y" holdable="0" headable="0" placeable="1" facing="left" width="0" height="0" asset_url="/api_v2/assets/${v.id}"/>`)
				.join("")}</ugc>`;
			break;
		}
		case "sound": {
			files = asset.getSounds();
			response = `${header}<ugc more="0">${files
				.map(v => `<sound subtype="${v.subtype}" id="${v.id}" enc_asset_id="${v.id}" name="Untitled" enable="Y" duration="${v.duration}" downloadtype="progressive"/>`)
				.join("")}</ugc>`;
			break;
		}
		default: { // no type? send a blank response
			response = `${header}<ugc more="0"></ugc>`;
			break;
		}
	};
	return response;
}

module.exports = function (req, res, url) {
	var makeZip = false; 
	switch (url.path) {
		case '/goapi/getUserAssets/': { 
			makeZip = true; 
			break; 
		}
		case '/api_v2/assets/team':
		case '/api_v2/assets/shared': {
			loadPost(req, res).then(data => listTeamAssets(data).then(a => {
                                var stuff;
				const type = stuff ? 'application/zip' : 'text/xml';
				res.setHeader("Content-Type", type), res.end(a);
			}));
			break;
		}
		case '/goapi/getUserAssetsXml/': { 
			if (process.env.DEBUG_MODE == "Y") { 
				loadPost(req, res).then(data => listTeamAssets(data).then(a => {
					res.setHeader("Content-Type", "text/html; charset=UTF-8"), res.end(a);
				}));
				return true;
				break;
			} else { 
			        break;
			}
		}
		case '/goapi/deleteUserTemplate/': { starter.delete(); starter.deleteThumb(); break; }
		// if i am able to make the meta for starters. case '/goapi/updateSysTemplateAttributes/': { starter.update(); break; }
		default: return;
	}

	switch (req.method) {
		case 'GET': {
			listAssets(url.query, makeZip).then(buff => {
				const type = makeZip ? 'application/zip' : 'text/xml';
				res.setHeader('Content-Type', type), res.end(buff);
			});
			return true;
		}
		case 'POST': {
			loadPost(req, res).then(data => listAssets(data, makeZip)).then(buff => {
				const type = makeZip ? 'application/zip' : 'text/xml';
				res.setHeader('Content-Type', type), res.end(buff);
			});
			return true;
		}
		default: return;
	}


}
