const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const client = {
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  mode: "development",
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html"
    })
  ],
  resolve: {
      modules: [
        'node_modules',
        path.resolve('node_modules')
      ]
  },
  module: {
      rules: [
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
};

module.exports = [client]