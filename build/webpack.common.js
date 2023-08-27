const isProduction = process.env.NODE_ENV === 'production'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src/main.ts')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: { appendTsSuffixTo: [/\.vue$/] }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(ttf|woff|woff2|eto|svg)$/,
        exclude: path.resolve(__dirname, '../src/assets/img'),
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        },
        generator: {
          filename: isProduction
            ? 'static/fonts/[name].[contenthash:8][ext]'
            : 'static/fonts/[name][ext]'
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        exclude: path.resolve(__dirname, '../src/assets/fonts'),
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024
          }
        },
        generator: {
          filename: isProduction ? 
          'static/img/[name].[contenthash:8][ext]' :
          'static/img/[name][ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset/resource',
        generator: {
          filename: isProduction ? 
          'static/video/[name].[contenthash:8][ext]' :
          'static/video/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      title: 'This is a template'
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          filter: (resourcePath) => {
            if (resourcePath.includes('/public/index.html')) {
              return false
            }

            return true
          }
        }
      ]
    })
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    clean: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@img': path.resolve(__dirname, '../src/assets/img')
    },
    extensions: ['.ts', '.js', '.vue']
  }
}
