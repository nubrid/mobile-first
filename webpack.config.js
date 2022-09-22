const webpack = require("webpack"),
  { Config, environment } = require("webpack-config"),
  cspBuilder = require("content-security-policy-builder"),
  fs = require("fs"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  LodashWebpackPlugin = require("lodash-webpack-plugin"),
  path = require("path"),
  _appConfig = require("./app.config"),
  _env = process.env.WEBPACK_ENV || process.env.NODE_ENV || "development",
  _getDirectories = (sourcePath, filterRegex) =>
    fs
      .readdirSync(sourcePath)
      .filter(
        file =>
          filterRegex.test(file) &&
          fs.statSync(path.join(sourcePath, file)).isDirectory(),
      )
      .reduce(
        (accumulator, currentValue) => ({
          ...accumulator,
          [currentValue]: `./${sourcePath}/${currentValue}`,
        }),
        {},
      ),
  _host = _appConfig.web.host,
  _isDev = _env === "development",
  _csp = {
    directives: {
      defaultSrc: ["'self'", "gap:", "https://ssl.gstatic.com"],
      mediaSrc: "*",
      imgSrc: ["'self'", "data:"],
      scriptSrc: ["'self'", `*.${_host}:*`, `http://*.${_host}:*`], // TODO: , "*.cloudflare.com:*", "*.googleapis.com:*", "fb.me:*", "*.fbcdn.net:*", "'sha256-b+bPlHI3Xupxz+xXVTazjfiOEv9to4g5ULdU6ZR+MKw='" ]
      connectSrc: [`ws://*.${_host}:*`, `wss://*.${_host}:*`], // TODO: for SharePoint -- , "*.microsoftonline.com:*" ]
      styleSrc: ["'self'", "'unsafe-inline'"],
      childSrc: "*",
    },
    toString() {
      if (_isDev) {
        this.directives.scriptSrc.push("'unsafe-eval'");
        this.directives.connectSrc.push(
          `http://*.${_host}:*`,
          `https://*.${_host}:*`,
        );
      }

      if (process.env.URL)
        this.directives.connectSrc.push(
          `ws://${process.env.URL.trim()}:*`,
          `wss://${process.env.URL.trim()}:*`,
        );

      return cspBuilder({ directives: this.directives });
    },
  };

const _primus = new (require("primus.io"))(
  new (require("events")).EventEmitter(),
  { transformer: _appConfig.primus.transformer },
);
_primus.save(path.resolve("dist/primus.io.js"));

environment.setAll({
  // HACK: webpack-config@6.1.x replaces [name] with process.env.name value. Revert to "[name]" again.
  name: () => "[name]", // eslint-disable-line lodash/prefer-constant
});

module.exports = new Config().extend(`webpack.config.${_env}.js`).merge({
  mode: _env,
  entry: {
    ..._getDirectories("script/js/apps", /^(?!common).*$/),
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
    // TODO: new webpack.ContextReplacementPlugin(
    //   /apps$/,
    //   new RegExp(
    //     `^./(${_getDirectories("script/js/apps", /^(?!common).*$/).join(
    //       "|",
    //     )})/index.js$`,
    //   ),
    // ),
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
    new LodashWebpackPlugin({
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
    new HtmlWebpackPlugin({
      title: "Nubrid",
      template: "script/index.ejs",
      inject: false,
      hash: true,
      xhtml: true,

      csp: _csp,
      isDev: _isDev,
      isMobile: process.env.MOBILE,
    }),
  ],
});
