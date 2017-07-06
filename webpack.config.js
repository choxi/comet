var glob = require("glob")
var path = require("path")

module.exports = {
  entry: {
    index: "./user/index.js",
  },
  output: {
    path: path.resolve('./dist'),
    filename: "[name].js",
    library: "skeleton",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        }
      }
    ]
  }
}
