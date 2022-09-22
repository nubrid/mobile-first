(function() {
	"use strict";
	var clc = require("cli-color");
	var argv = require("yargs")
		.usage("Usage: $0 <message> [options]")
		.demand(1)
		.example("$0 \"Hello World!\"")
		.example("$0 \"Hello World!\" i")
		.example("$0 \"Hello World!\" info")
		.example("$0 \"Hello World!\" -i")
		.example("$0 \"Hello World!\" -info")
		.example("$0 \"Hello World!\" -v i")
		.example("$0 \"Hello World!\" -v info")
		.options({
			"v": {
				alias: "verbose"
				, describe: "Verbose level:\ni - info\nw - warn\ne - error"
				, nargs: 1
			}
			, "i": {
				alias: "info"
				, nargs: 0
			}
			, "w": {
				alias: "warn"
				, nargs: 0
			}
			, "e": {
				alias: "error"
				, nargs: 0
			}
		})
		.help("h")
		.alias("h", "help")
		.epilog("copyright 2015")
		.argv;

	module.exports = function() {
		var color = clc.blueBright;
		switch (argv.v || argv.e || argv.w || argv.i || argv._[1]) {
			case "i":
			case "info":
				color = clc.blueBright;
				break;
			case "w":
			case "warn":
				color = clc.yellowBright;
				break;
			case "e":
			case "error":
				color = clc.redBright;
				break;
		}

		console.log(color(argv._[0]));
	};
})();