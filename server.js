var express = require("express"),
	jade = require("jade"),
	sass = require("node-sass");
	path = require("path"),
	fs = require("fs"),
	GitHubApi = require("github"),
	_ = require("lodash")
	app = express(),
	github = new GitHubApi({
		version: "3.0.0",
		debug: true,
		protocol: "https",
		host: "api.github.com"
	});
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
app.listen(80);