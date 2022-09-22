/* https://github.com/jrburke/r.js/blob/master/build/example.build.js */
({
	mainConfigFile: "require.config.js"
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
		, {
			name: "apps/poc/App"
			, include: [
				"apps/poc/list/Controller"
			]
			, exclude: [
				"main"
			]
		}
	]
	, optimize: "uglify2"
	, generateSourceMaps: true
	, preserveLicenseComments: false
	, useSourceUrl: false
	, fileExclusionRegExp: /^main.build.js$|libs/
	//, keepBuildDir: true
	, useStrict: true
	//, findNestedDependencies: true
	, removeCombined: true
	, optimizeCss: "standard.keepLines"
});