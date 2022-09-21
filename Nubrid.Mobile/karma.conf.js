module.exports = function (config) {
	"use strict";
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: "",

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ["mocha", "requirejs"],

		// list of files / patterns to load in the browser
		files: [
			{ pattern: "src/js/**/*.js", included: false },
			{ pattern: "test/**/*.spec.js", included: false, watched: false },
			{ pattern: "node_modules/chai/chai.js", included: false },
			{ pattern: "node_modules/chai-as-promised/lib/chai-as-promised.js", included: false },
			{ pattern: "node_modules/chai-jquery/chai-jquery.js", included: false },
			{ pattern: "node_modules/sinon/pkg/sinon.js", included: false },
			{ pattern: "node_modules/sinon-chai/lib/sinon-chai.js", included: false },
			{ pattern: "test/test.main.js", included: true, watched: false }
		],

		// list of files to exclude
		exclude: [
			"src/js/main.js",
			"src/js/main.build.js"
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			//"**/*.coffee": ["coffee"]
		},

		//coffeePreprocessor: {
		//	// options passed to the coffee compiler
		//	options: {
		//		bare: true,
		//		sourceMap: false
		//	},
		//	// transforming the filenames
		//	transformPath: function(path) {
		//		return path.replace(/\.coffee$/, ".js");
		//	}
		//},

		// test results reporter to use
		// possible values: "dots", "progress"
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ["progress"],

		// web server port
		port: 8084,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ["Chrome"], //, "Firefox", "IE", "PhantomJS", "ChromeCanary"],

		customLaunchers: {
			"PhantomJS_custom": {
				base: "PhantomJS",
				//options: {
				//	windowName: "window",
				//	settings: {
				//		webSecurityEnabled: false
				//	},
				//},
				flags: ["--remote-debugger-port=8085", "--remote-debugger-autorun=yes"] //flags: ["--load-images=true"],
				//debug: true
			}
		},

		phantomjsLauncher: {
			// Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
			exitOnResourceError: true
		},

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false
	});
};