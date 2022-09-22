const webpack = require("webpack"),
  // TODO: Build & Debug scripts
  // { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer"),
  // CleanPlugin = require("clean-webpack-plugin"),
  { Config /*, environment*/ } = require("webpack-config"),
  CopyPlugin = require("copy-webpack-plugin"),
  cspBuilder = require("content-security-policy-builder"),
  HtmlPlugin = require("html-webpack-plugin"),
  LodashPlugin = require("lodash-webpack-plugin"),
  path = require("path"),
  WebAppManifestPlugin = require("webpack-pwa-manifest"),
  WorkboxPlugin = require("workbox-webpack-plugin"),
  _appConfig = require("./app.config"),
  _env = process.env.WEBPACK_ENV || process.env.NODE_ENV || "development",
  _host = _appConfig.web.host,
  _isDev = _env === "development",
  _csp = {
    directives: {
      defaultSrc: ["'self'", "gap:", "https://ssl.gstatic.com"],
      mediaSrc: "*",
      imgSrc: ["'self'", "data:"],
      scriptSrc: ["'self'", `*.${_host}:*`, `http://*.${_host}:*`], // TODO: , "*.cloudflare.com:*", "*.googleapis.com:*", "fb.me:*", "*.fbcdn.net:*", "'sha256-b+bPlHI3Xupxz+xXVTazjfiOEv9to4g5ULdU6ZR+MKw='" ]
      connectSrc: [`ws://*.${_host}:*`, `wss://*.${_host}:*`], // TODO: for SharePoint -- , "*.microsoftonline.com:*" ]
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com:*"],
      fontSrc: ["https://fonts.gstatic.com:*"],
      childSrc: "*",
    },
    toString() {
      if (_isDev) {
        this.directives.scriptSrc.push("'unsafe-eval'") // eslint-disable-line immutable/no-this
        // eslint-disable-next-line immutable/no-this
        this.directives.connectSrc.push(
          `http://*.${_host}:*`,
          `https://*.${_host}:*`,
        )
      }

      if (process.env.URL)
        // eslint-disable-next-line immutable/no-this
        this.directives.connectSrc.push(
          `ws://${process.env.URL.trim()}:*`,
          `wss://${process.env.URL.trim()}:*`,
        )

      return cspBuilder({ directives: this.directives }) // eslint-disable-line immutable/no-this
    },
  }

const _primus = new (require("primus.io"))(
  new (require("events")).EventEmitter(),
  { transformer: _appConfig.primus.transformer },
)
_primus.save(path.resolve("dist/primus.io.js"))

// TODO: output.filename with [name] works
// environment.setAll({
//   // HACK: webpack-config@6.1.x replaces [name] with process.env.name value. Revert to "[name]" again.
//   name: () => "[name]", // eslint-disable-line lodash/prefer-constant
// });

module.exports = new Config().extend(`webpack.config.${_env}.js`).merge({
  mode: _env,
  entry: {
    main: "main",
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 1,
        },
      },
    },
  },
  output: {
    path: "/src",
    publicPath: "/",
    filename: "js/[name].js",
  },
  resolve: {
    modules: [
      path.resolve("script/js"),
      path.resolve("script/css"),
      path.resolve("script/img"),
      "node_modules",
      "dist",
    ],
    // TODO: , extensions: [ ".js", ".json", ".coffee" ]
    alias: {
      cordova: "../cordova",
      // TODO: , "pouchdb$": "libs/pouchdb"
      // , "pouchdb-socket$": "socket-pouch/lib/client"
      "primus.io$": "primus.io.js",
      "react-dom": "@hot-loader/react-dom", // TODO: until react-hot-loader or react-dom has been patched.
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
    new HtmlPlugin({
      title: "Nubrid",
      template: "script/index.ejs",
      inject: false,
      xhtml: true,

      csp: _csp,
      isDev: _isDev,
      isMobile: process.env.MOBILE,
    }),
    new CopyPlugin([
      {
        from: "script/favicon.ico",
        to: "favicon.ico",
      },
      {
        from: "script/css/noscript.css",
        to: "css/noscript.css",
      },
    ]),
    new WebAppManifestPlugin({
      // TODO: PWA
      name: "Nubrid",
      short_name: "Nubrid",
      description: "Nubrid",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      display: "fullscreen",
      ios: {
        // TODO: Conditional build
        "apple-mobile-web-app-title": "Nubrid",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "black-translucent",
      },
      // TODO: PWA: icons: [
      //   {
      //     src: path.resolve("script/img/icons/ios.png"),
      //     sizes: [120, 152, 167, 180],
      //     ios: true,
      //   },
      //   {
      //     src: path.resolve("script/img/icons/ios.png"),
      //     sizes: [1024],
      //     ios: "startup",
      //   },
      //   {
      //     src: path.resolve("script/img/icons/android.png"),
      //     sizes: [36, 48, 72, 96, 144, 192, 512],
      //   },
      // ],
    }),

    // TODO: Build & Debug scripts
    // new CleanPlugin(["www"]),
    // new BundleAnalyzerPlugin({ analyzerPort: 8100, openAnalyzer: false }),

    // NOTE: Basic Workbox ServiceWorker
    // new WorkboxPlugin.GenerateSW({
    //   swDest: "serviceWorker.js",
    //   clientsClaim: true,
    //   skipWaiting: true,
    //   runtimeCaching: [
    //     {
    //       urlPattern: /^https:\/\/fonts\.googleapis\.com/,
    //       handler: "staleWhileRevalidate",
    //     },
    //     {
    //       urlPattern: /^https:\/\/fonts\.gstatic\.com/,
    //       handler: "cacheFirst",
    //     },
    //   ],
    // }),
    // TODO: Using Local Workbox Files Instead of CDN
    new WorkboxPlugin.InjectManifest({
      swSrc: "script/js/serviceWorker.js",
      swDest: "serviceWorker.js",
    }),
  ],
})
