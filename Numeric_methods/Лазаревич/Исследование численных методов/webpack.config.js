const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
  ,
  module: {
    rules:[
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use:{
        loader: "babel-loader"
      }
    },
    {
        test: /\.css$/,
        use: ['css-loader']
    }
    /*,doesnt work on webpack 4
    {
      test: /\.js$/,
      exclude: /node_modules/,
      enforce: "pre",
      use: {
        loader:'jshint-loader'
      }
    }*/
    ]
  }
};
