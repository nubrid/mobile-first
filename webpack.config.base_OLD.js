const webpack = require("webpack"),
  { Config } = require("webpack-config"),
  fs = require("fs"),
  LodashPlugin = require("lodash-webpack-plugin"),
  path = require("path"),
  _getDirectories = (sourcePath, filterRegex) =>
    fs
      .readdirSync(sourcePath)
      .filter(
        file =>
          filterRegex.test(file) &&
          fs.statSync(path.join(sourcePath, file)).isDirectory(),
      );

const _config = {
  entry: {
    main: "main",
    // TODO: , vendor: [ // NOTE: Must follow dependency sequence
    // 	"./modernizr-config.json"
    // 	, "react"
    // 	, "react-dom"
    // 	// TODO: , "react-addons-transition-group"
    // 	// , "react-addons-css-transition-group"
    // ]
  },
  output: {
    path: "/src",
    publicPath: "/",
    filename: "js/[name].js",
  },
  resolve: {
    modules: [path.resolve("script/js"), "node_modules", "dist"],
    // TODO: , extensions: [ ".js", ".json", ".coffee" ]
    alias: {
      cordova: "../cordova",
      // TODO: , "pouchdb$": "libs/pouchdb"
      // , "pouchdb-socket$": "socket-pouch/lib/client"
      "primus.io$": "primus.io.js",
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /(dist|node_modules|bower_components)/,
        options: {
          presets: [
            [
              "@babel/env",
              {
                targets: "last 2 versions, > 1%, ie 11",
                loose: true,
                modules: false,
              },
            ],
            "@babel/react",
          ],
          plugins: [
            "lodash",
            "@babel/proposal-class-properties",
            "@babel/proposal-export-default-from",
            "@babel/proposal-export-namespace-from",
            "@babel/proposal-object-rest-spread",
            "@babel/syntax-dynamic-import",
            ["@babel/transform-runtime", { corejs: 2 }],
            "@babel/transform-strict-mode",
            "react-hot-loader/babel",
          ],
          sourceMaps: "inline",
          retainLines: true,
          cacheDirectory: true, // HACK: Set to false when having weird problems
        },
      },
      { test: /\.(png|jpg)$/, loader: "url-loader?limit=8192" },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        type: "javascript/auto",
        test: /modernizr-config\.json$/,
        loader: "webpack-modernizr-loader",
      },

      { test: /\.coffee$/, loader: "coffee-loader" },
      {
        test: /sinon.*\.js$/,
        loader: "imports-loader?define=>false,require=>false",
      },
    ],
    noParse: [/primus\.io/, /sinon\/pkg\/sinon/],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /apps$/,
      new RegExp(
        `^./(${_getDirectories("script/js/apps", /^(?!common).*$/).join(
          "|",
        )})/index.js$`,
      ),
    ),
    new webpack.DefinePlugin({
      __MOBILE__: JSON.stringify(JSON.parse(process.env.MOBILE || "false")),
      __URL__: JSON.stringify(`${process.env.URL || ""}`.trim()),
    }),
    new webpack.IgnorePlugin(/^cordova$/),
    new webpack.ProvidePlugin({
      AppManager: "common",
      Modernizr: path.resolve("modernizr-config.json"),
      PropTypes: "prop-types",
      React: "react",
      ReactDOM: "react-dom",
      // TODO: , ReactCSSTransitionGroup: "react-addons-css-transition-group"
      ReactRedux: "react-redux",
      // TODO: , ReactTransitionGroup: "react-addons-transition-group"
      Redux: "redux",

      chai: "chai",
      sinon: "sinon/pkg/sinon",
    }),
    new LodashPlugin({
      caching: false,
      chaining: false,
      cloning: true,
      coercions: false,
      collections: true,
      currying: false,
      deburring: false,
      exotics: false,
      flattening: false,
      guards: false,
      memoizing: false,
      metadata: false,
      paths: true,
      placeholders: false,
      shorthands: false,
      unicode: false,
    }),
  ],
};

module.exports = new Config().merge(_config);
