const importer = $("#importer");
const previewer = $("#previewer");
const studio = $("#obj");

/**
 * studio functions
 */
interactiveTutorial = { // hide interactive tutorial
	neverDisplay: function() {
		return true;
	}
};
function studioLoaded(arg) { console.log(arg) }
function exitStudio() { window.location = "/" }

/**
 * show and hide widgets
 */
let importerVisible = false;
function showImporter() {
	switch(importerVisible) {
		case true: {
			hideImporter();
			break;
		}
		case false:
		default: {
			importerVisible = true;
			importer.show();
			if (!importer.data("importer"))
				importer.data("importer", new AssetImporter(importer))
			studio.openYourLibrary();
		}
	}
	return true;
}
function hideImporter() {
	importerVisible = false;
	importer.hide();
}
function initPreviewPlayer(dataXmlStr, startFrame) {
	movieDataXmlStr = dataXmlStr;

	filmXmlStr = dataXmlStr.split("<filmxml>")[1].split("</filmxml>")[0];

	if (typeof startFrame == 'undefined') {
		startFrame = 1;
	} else {
		startFrame = Math.max(1, parseInt(startFrame));
	}

	previewer.css("display", "block");

	hideImporter(); // hide importer before previewing
	

	/* allow the user to preview their video from a scene that they desided to preview */ document.getElementById('preview_player').innerHTML = `
	<object data="https://localhost:4664/animation/414827163ad4eb60/player.swf" type="application/x-shockwave-flash" width="800" height="450">
	<param name="flashvars" value="apiserver=/&amp;isEmbed=1&amp;tlang=en_US&amp;isInitFromExternal=1&amp;startFrame=${startFrame}&amp;autostart=1&amp;storePath=https://localhost:4664/store/3a981f5cb2739137/&lt;store&gt;&amp;clientThemePath=https://localhost:4664/static/ad44370a650793d9/&lt;client_theme&gt;" />
	<param name="allowScriptAccess" value="always" />
	<param name="allowFullScreen" value="true" />
	</object>`;
	
	studio.css("height", "0");
}
function retrievePreviewPlayerData() { return movieDataXmlStr }
function hidePreviewer() {
	previewer.css("display", "none");
	studio.css("height", "");
}

/**
 * importer
 */
class AssetImporter {
	constructor(importer) {
		this.importer = importer;
		this.queue = importer.find("#importer-queue");
		this.config = { maxsize: false };
		this.initialize();
	}
	initialize() {
		this.importer.find("#importer-files").on("change", event => {
			//uploads every file
			var fileUpload = document.getElementById("importer-files");
			for (var i = 0; i < fileUpload.files.length; i++) {
				this.addFiles(fileUpload.files[i]);
			}
		});
		this.importer.on("dragover", event => {
			event.preventDefault();
			event.stopPropagation();
		});
		this.importer.on("dragenter", event => {
			event.preventDefault();
			event.stopPropagation();
		})
		this.importer.on("drop", event => {
			event.preventDefault();
			event.stopPropagation();
			const files = event.originalEvent.dataTransfer.files;
			for (var i = 0; i < files.length; i++) {
				this.addFiles(files[i]);
			}
		})
	}
	addFiles(file) { //adds a file to the queue
		//image importing
		const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
		const maxsize = this.config.maxsize;
		if (maxsize && file.size > maxsize) return; // check if file is too large
		var validFileType = false;
		let el;
		switch (ext) {
			case "mp3":
			case "wav": {
				validFileType = true;
				el = $(`
					<div class="importer_asset">
						<div class="asset_metadata">
							<img class="asset_preview" src="/pages/img/importer/sound.png" />
							<div>
								<h4 contenteditable="true" class="asset_name">${file.name}</h4>
								<p class="asset_subtype">${filesize(file.size)} | Import as...</p>
							</div>
						</div>
						<div class="import_as">
							<a href="#" type="bgmusic">Music</a>
							<a href="#" type="soundeffect">Sound effect</a>
							<a href="#" type="voiceover">Voiceover</a>
						</div>
					</div>
				`).appendTo(this.queue);
				break;
			}
			case "jpg":
			case "png": {
				validFileType = true;
				el = $(`
					<div class="importer_asset">
						<div class="asset_metadata">
							<img class="asset_preview" src="/pages/img/importer/image.png" />
							<div>
								<h4 contenteditable="true" class="asset_name">${file.name}</h4>
								<p class="asset_subtype">${filesize(file.size)} | Import as...</p>
							</div>
						</div>
						<div class="import_as">
							<a href="#" type="bg">Background</a>
							<a href="#" type="prop">Prop</a>
						</div>
					</div>
				`).appendTo(this.queue);
				const fr = new FileReader();
				fr.addEventListener("load", e => {
					el.find("img").attr("src", e.target.result);
				})
				fr.readAsDataURL(file);
				break;
			}
		}
		if (!validFileType) {
			console.error("Invalid file type!");
			return;
		}
		const request = new ImporterFile(file, el, ext);
	}
}
class ImporterFile {
	constructor(file, element, ext) {
		this.file = file;
		this.el = element;
		this.ext = ext;
		this.initialize();
	}
	initialize() {
		this.el.find("[type]").on("click", (event) => {
			const el = $(event.target);
			const type = el.attr("type");
			const t = this.typeFickser(type);
			const name = $(event.target).parents('.importer_asset').find('.asset_name').text();
			this.upload(name.replace(/\s/g, '_'), t);
		});
	}
	typeFickser(type) {
		switch (type) {
			case "bgmusic":
			case "soundeffect":
			case "voiceover": {
				return { type: "sound", subtype: type };
			}
			case "bg":
			case "prop": {
				return { type: type, subtype: 0 };
			}
		}
	}
	async upload(passedname, type) {
		var name = passedname;
		if (name == "")
			name = "unnamed" + Math.random().toString().substring(2, 8); 
		var b = new FormData();
		b.append("import", this.file);
		b.append("name", name)
		b.append("type", type.type);
		b.append("subtype", type.subtype);
		$.ajax({
			url: "/api/asset/upload",
			method: "POST",
			data: b,
			processData: false,
			contentType: false,
			dataType: "json"
		}).done(d => {
			studio[0].importerStatus("done");
			this.el.fadeOut(() => this.el.remove())
		}).catch(e => console.error("Import failed."))
	}
}
