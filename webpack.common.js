const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, './index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
          test: /\.node$/,
          loader: "node-loader",
      },
      {
          test: /\.(jsx|js)$/,
          include: path.resolve(__dirname),
          exclude: /node_modules/,
          use: [{
          loader: 'babel-loader',
          options: {
              presets: [
              [
                  '@babel/preset-env',
                  { targets: "defaults" }
              ],
              '@babel/preset-react'
              ]
          }
          }]
      },
      {
          test: /\.(css)$/,
          include: path.resolve(__dirname, 'src'),
          use: ["style-loader", "css-loader"],
      },
      {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
      }
    ]
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
  }
};