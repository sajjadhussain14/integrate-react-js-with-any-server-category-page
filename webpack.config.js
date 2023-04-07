const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const WorkboxPlugin = require("workbox-webpack-plugin");
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dev = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    index: { import: "./src/index.js" },
  },

  output: {
    path: path.resolve(__dirname, "out"),
    filename: "[name].js",
    //sourceMapFilename: "[name].[hash:8].map",
    chunkFilename: "react[name].js",
    clean: true,
  },
  devServer: {
    port: 3010,
    watchContentBase: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 10000,
      maxSize: 250000,
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  devtool: false,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.cfm",

      template: "./src/template.html",
      minify: {
        collapseWhitespace: false,
        minifyCSS: true,
        minifyJS: false,
      },
      cache: {},
    }),
  ],
  cache: false,
};
