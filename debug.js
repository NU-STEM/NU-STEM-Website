var sys = require("sys"),
	exec = require("child_process").exec;
function puts(error, stdout, stdeer) { sys.puts(stdout); }
exec("node auto.js");
exec("node server.js");