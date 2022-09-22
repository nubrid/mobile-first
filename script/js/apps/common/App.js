/*
Common App
*/
function _getControllerPaths(views, name) {
	let paths = [];
	_.each(views, (view, index) => {
		paths[index] = `apps/${name}/${view}/Controller`;
	});

	return paths;
}

export default {
	views: ["show"]
	, start( moduleName ) {
		require(_getControllerPaths(this.views, moduleName), $.proxy(function () {
			_.each(arguments, (Controller, index) => {
				let appRoutes = {};

				if (moduleName === "home") _.extend(appRoutes, { "": this.views[0] });
				appRoutes[moduleName] = this.views[index];

				let controller = new Controller({ id: moduleName });

				/* jshint nonew: false */
				new Marionette.AppRouter({
					appRoutes
					, controller
				});

				controller.show();
			});
		}, this));
	}
};