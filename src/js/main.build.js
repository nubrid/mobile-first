/* https://github.com/jrburke/r.js/blob/master/build/example.build.js */
/* jshint -W030 */
({
	mainConfigFile: "main.config.js"
	, appDir: "../"
	, dir: "../../www"
	, modules: [
		{
			name: "main"
			, include: [
				"app"
				, "apps/common/App"
				, "apps/common/Controller"
				, "apps/common/Dispatcher"
				, "apps/common/UI"
				, "apps/common/View"
				, "entities/Common"
			]
		}
		, {
			name: "apps/home/App"
			, include: [
				"apps/home/show/Controller"
			]
			, exclude: [
				"main"
			]
		}
		, {
			name: "apps/pointme/App"
			, include: [
				"apps/pointme/show/Controller"
			]
			, exclude: [
				"main"
			]
		}
		, {
			name: "apps/todos/App"
			, include: [
				"apps/todos/show/Controller"
			]
			, exclude: [
				"main"
			]
		}
	]
	, optimize: "uglify"
	// , uglify: {
	// 	compress: true
	// 	, mangle: true
	// 	, prefix: "relative"
	// }
	, skipDirOptimize: true
	, generateSourceMaps: true
	, useSourceUrl: false
	, optimizeCss: "standard.keepLines"
	, useStrict: true
	, removeCombined: true
	, preserveLicenseComments: false
	, writeBuildTxt: false
	, fileExclusionRegExp: /^(main.build.js|libs|img)$/
});