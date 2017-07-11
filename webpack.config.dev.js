import path from 'path';
import webpack from 'webpack';

export default {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, '/client/index.js')
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: '/'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.join(__dirname, 'client'),
          path.join(__dirname, 'shared')
        ],
        loaders: [ 'react-hot-loader', 'babel-loader' ]
      }
    ]
  },
  resolve: {
    extensions: [ '*', '.js' ],
    alias: {
      shared: path.resolve(__dirname, 'shared'),
      utils: path.resolve(__dirname, 'client/utils')
    }
  }
}
