const { DefinePlugin, HotModuleReplacementPlugin } = require("webpack"),
  { Config } = require("webpack-config");

module.exports = new Config().merge({
  entry: {
    main: [
      "main",
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true",
      "react-hot-loader/patch",
    ],
  },
  devServer: { contentBase: "./src" },
  devtool: "cheap-eval-source-map", // NOTE: For more debug details, use cheap-module-eval-source-map < eval-source-map
  plugins: [
    new DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
    new HotModuleReplacementPlugin(),
  ],
});
