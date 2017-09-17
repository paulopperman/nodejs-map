// Use Webpack to bundle JS/CSS/HTML files

const path = require('path')
const BabiliPlugin = require('babili-webpack-plugin')

// Babel loader for transpiling ES8 Javascript for browswer usage
const babelLoader = {
  test: /\.js$/,
  loader: 'babel-loader',
  include: [path.resolve(__dirname, '../app')],
  query: { presets: ['es2017'] }
}

// SCSS loader for transpilig SCSS files to CSS
const scssLoader = {
  test: /\.scss$/,
  loader: 'style-loader!css-loader!sass-loader'
}

// URL loader to resolve data-urls at build time
const urlLoader = {
  test: /\.(png|woff|woff2|eot|ttf|svg)$/,
  loader: 'url-loader?limit-100000'
}

// HTML load to allow us to import HTML templates into our JS files
const htmlLoader = {
  test: /\.html$/,
  loader: 'html-loader'
}

const webpackConfig = {
  entry: './app/main.js', // start at app/main.js
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js' // output to public/bundle.js
  },
  module: { loaders: [babelLoader, scssLoader, urlLoader, htmlLoader] }
}

if (process.env.NODE_ENV === 'production') {
  // Minify for production build
  webpackConfig.plugins = [ new BabiliPlugin({}) ]
} else {
  // generate sourcemaps for dev build
  webpackConfig.devtool = 'eval-source-map'
}

module.exports = webpackConfig
