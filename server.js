var express = require("express"),
	jade = require("jade"),
	sass = require("node-sass");
	path = require("path"),
	fs = require("fs"),
	watchr = require("watchr"),
	GitHubApi = require("github"),
	_ = require("lodash"),
	debug = process.argv.length == 3;
	app = express(),
	port = process.env.PORT || 80,
	github = new GitHubApi({
		version: "3.0.0",
		debug: true,
		protocol: "https",
		host: "api.github.com"
	});
console.log("Running on port " + port);
if (debug) {
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
	});
}
app.locals = {
	"github": {}
};
github.orgs.get({
	"org": "NU-STEM"
}, function(err, data) {
	if (err) console.warn(err);
	else {
		app.locals.github.org = data;
	}
});
github.repos.getFromOrg({
	"org": "NU-STEM"
}, function(err, data) {
	if (err) console.warn(err);
	else {
		// Sort data by date and limit to 5
		// Name in the name property
		// Date updated at in the updated_at property
		app.locals.github.repos = data;
	}
});
var fontsDir = __dirname + "/fonts/",
	imagesDir = __dirname + "/images/",
	scssDir = __dirname + "/scss/",
	cssDir = __dirname + "/css/",
	jsDir = __dirname + "/js/";
app.set("views", __dirname + "/jade");
app.set("view engine", "jade");
app.engine("jade", jade.__express);
app.use("/css", express.static(cssDir));
app.use("/js", express.static(jsDir));
app.use("/fonts", express.static(fontsDir));
app.use("/images", express.static(imagesDir));
app.get("/", function(req, res) {
	res.render("index");
});
app.get("*", function(req, res) {
	res.end();
});
app.listen(port);