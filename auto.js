var fs = require("fs"),
	sass = require("node-sass"),
	compressor = require("node-minify"),
	path = require("path"),
	watchr = require("watchr"),
	_ = require("lodash");
var	scssDir = __dirname + "/scss/",
	cssDir = __dirname + "/css/",
	jsDir = __dirname + "/js/",
	files;
watchr.watch({
	paths: [scssDir],
	listeners: {
		change: function(changeType, filePath, fileCurrentStat, filePreviousStat) {
			process.stdout.write("Reloading " + filePath + "...");
			var ext = path.extname(filePath),
				base = path.basename(filePath, ext),
				filename = base + ".min.css",
				compileFilePath = cssDir + filename;
			sass.render({
				file: filePath,
				outputStyle: "compressed",
				success: function(data) {
					fs.writeFile(compileFilePath, data);
				}
			});
			process.stdout.write("done\n");
		}
	}
});
watchr.watch({
	paths: [jsDir],
	listeners: {
		change: function(changeType, filePath, fileCurrentStat, filePreviousStat) {
			var ext = path.extname(filePath),
				base = path.basename(filePath, ext);
			if (path.extname(base) == ".min") return;
			process.stdout.write("Reloading " + filePath + "...");
			var filename = base + ".min.js",
				compileFilePath = jsDir + filename;
			new compressor.minify({
				type: "gcc",
				fileIn: filePath,
				fileOut: compileFilePath,
				callback: function(err, min) {
					if (err) return console.warn(err);
				}
			});
			process.stdout.write("done\n");
		}
	}
})