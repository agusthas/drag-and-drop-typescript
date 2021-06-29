const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/app.ts',
  output: {
    // ada [contenthash] coba baca webpack docs
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
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