const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')



const isDev = process.env.NodeJS_env === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }
  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoader = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {},
    },
    'css-loader',
  ]

  if(extra){
    loaders.push(extra)
  }

  return loaders
}

const babelOptions = preset => {
  const opts = {
  presets: [
      '@babel/preset-env'
    ]
  }

  if (preset) {
    opts.presets.push(preset)
  }

  return opts
}

const plugins = () => {
  const base = [
    new HtmlWebpackPlugin({
      // template: './index.html',
      template: './index.pug',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from:  path.resolve(__dirname, 'src/favicon.ico'), to: path.resolve(__dirname, 'dist') }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ]

  // if (isProd) {
  //   base.push(new BundleAnalyzerPlugin())
  // }

  return base
}



module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: ['@babel/polyfill', './index.js'],
    analytics: './analytics.ts'
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.json', '.png', '.css'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@src': path.resolve(__dirname, 'src')
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    open: true,
    // hot: false
    hot: isDev
  },
  devtool: isDev ? 'source-map' : false,
  mode: 'development',
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoader()
      },
      {
        test: /\.less$/,
        use: cssLoader('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoader('sass-loader')
      },
      {
       test: /\.(png|jpg|svg|gif)/,
       type: 'asset/resource'
      },
      {
        test: /\.xml$/,
        use: 'xml-loader'
      },
      {
        test: /\.csv$/,
        use: 'csv-loader'
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions()
        }
      },
      {
        test: /\.m?ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript')
        }
      },
      {
        test: /\.m?jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react')
        }
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: {
          loader: 'pug-loader',
        }
      }
    ]
  }
}