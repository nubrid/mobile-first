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
				, "apps/common/Dispatcher"
				, "apps/common/View"
				, "entities/Todo"
			]
		}
		, {
			name: "apps/home/App"
			, include: [
				"apps/home/show/Controller"
			]
			, exclude: [
				"apps/AppManager"
				, "apps/common/Dispatcher"
				, "apps/common/View"
				, "entities/Todo"
			]
		}
		, {
			name: "apps/todos/App"
			, include: [
				"apps/todos/list/Controller"
			]
			, exclude: [
				"apps/AppManager"
				, "apps/common/Dispatcher"
				, "apps/common/View"
				, "entities/Todo"
			]
		}
		, {
			name: "apps/poc/App"
			, include: [
				"apps/poc/list/Controller"
			]
			, exclude: [
				"apps/AppManager"
				, "apps/common/Dispatcher"
				, "apps/common/View"
				, "entities/Todo"
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