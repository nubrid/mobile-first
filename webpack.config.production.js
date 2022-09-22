const webpack = require("webpack"),
  { Config } = require("webpack-config");

module.exports = new Config().merge({
  plugins: [
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }),
    // TODO: , new webpack.optimize.LimitChunkCountPlugin( { maxChunks: 15 } )
  ],
});
