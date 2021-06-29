const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    // ada [contenthash] coba baca webpack docs
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    publicPath: '/dist/',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
