import path from 'path'

const config = {
  target: 'node',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  devtool: 'source-map'
}

export default config
