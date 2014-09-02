var fs = require("fs"),
	sass = require("node-sass"),
	compressor = require("node-minify"),
	path = require("path"),
	_ = require("lodash");
var imagesDir = __dirname + "/images/",
	scssDir = __dirname + "/scss/",
	cssDir = __dirname + "/css/",
	jsDir = __dirname + "/js/",
	files;
files = fs.readdirSync(scssDir);
for (var i = 0, len = files.length; i < len; i++) {
	file = files[i]
	ext = path.extname(file);
	filename = path.basename(file, ext);
	fs.writeFileSync(cssDir + filename + ".css", sass.renderSync({
		data: fs.readFileSync(scssDir + file),
		outputStyle: "compressed"
	}));
}
files = fs.readdirSync(cssDir);
files = _.filter(files, function(file) {
	ext = path.extname(file);
	filename = path.basename(file, ext);
	return path.extname(filename) != ".min";
});
files = _.map(files, function(file) {
	return cssDir + file;
});
files = fs.readdirSync(jsDir);
files = _.filter(files, function(file) {
	ext = path.extname(file);
	filename = path.basename(file, ext);
	return path.extname(filename) != ".min";
});
files = _.map(files, function(file) {
	return jsDir + file;
});
new compressor.minify({
	type: "gcc",
	fileIn: files,
	fileOut: jsDir + "script.min.js",
	callback: function(err, min) {
		if (err) console.warn(err);
	}
});