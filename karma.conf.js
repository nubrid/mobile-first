const _webpackConfig = require("./webpack.config.test");

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["mocha"],

    // list of files / patterns to load in the browser
    files: [{ pattern: "test/test.main.js", included: true, watched: false }],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "test/test.main.js": ["webpack"],
    },

    webpack: _webpackConfig,
    webpackMiddleware: {
      publicPath: _webpackConfig.output.publicPath,
      stats: {
        assets: true,
        chunks: true,
        chunkModules: false,
        colors: true,
        hash: false,
        timings: false,
        version: false,
      },
    },

    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["mocha"],

    // web server port
    port: 8300,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome_custom"], //[ "Chrome", "Firefox", "IE", "PhantomJS", "ChromeCanary" ],

    customLaunchers: {
      PhantomJS_custom: {
        base: "PhantomJS",
        //options: {
        //	windowName: "window",
        //	settings: {
        //		webSecurityEnabled: false
        //	},
        //},
        flags: [
          "--remote-debugger-port=8301",
          "--remote-debugger-autorun=yes" /*, "--load-images=true"*/,
        ],
        //debug: true
      },
      Chrome_custom: {
        base: "Chrome",
        flags: ["--incognito"],
      },
    },

    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true,
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
  });
};
