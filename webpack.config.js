const path = require("path");
const slsw = require("serverless-webpack");

// const entries = {};

// Object.keys(slsw.lib.entries).forEach(
//   key => (entries[key] = ['./scripts/source-map-install.js', slsw.lib.entries[key]])
// );

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  stats: "errors-only",
  entry: slsw.lib.entries,
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    alias: {
      src: path.join(__dirname, "src")
    }
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js"
  },
  target: "node",
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  }
};
