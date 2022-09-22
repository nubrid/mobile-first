/* https://github.com/jrburke/r.js/blob/master/build/example.build.js */
({
	mainConfigFile: "src/js/main.config.js" //"main.config.js"
	, appDir: "src" //"../"
	, dir: "www" //"../../www"
	, modules: [
		{
			name: "main"
			, include: [
				"apps/common/App"
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
	, fileExclusionRegExp: /^(libs|img)$/
});