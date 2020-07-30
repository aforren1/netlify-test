const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const JavaScriptObfuscator = require('webpack-obfuscator')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const prod = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].bundle.js',
    chunkFilename: '[name].[contenthash].chunk.js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          filename: '[name].[contenthash].bundle.js'
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '../dist/*.js')] }),
    new JavaScriptObfuscator(
      {
        rotateStringArray: true,
        stringArray: true,
        // stringArrayEncoding: 'base64', // disabled by default
        stringArrayThreshold: 0.75
      },
      ['vendors.*.js']
    )
  ]
}

module.exports = merge(common, prod)
