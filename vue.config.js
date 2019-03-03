const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const debug = process.env.NODE_ENV !== 'production'
let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'
// let cesiumWorkers = 'Workers'
module.exports = {
  baseUrl: '',
  devServer: {
    open: false,
    https: false,
    port: 8090,
    // proxy: {//配置跨域
    //         '/api': {
    //             target: 'http://cesiumjs.org',//这里后台的地址模拟的;应该填写你们真实的后台接口
    //             ws: true,
    //             changOrigin: true,//允许跨域
    //             pathRewrite: {
    //                 '^/api': ''//请求的时候使用这个api就可以
    //             }
    //         }
            
    //     } 
  },
  outputDir: 'docs',
  configureWebpack: {
    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve('src'),
        'cesium': path.resolve(__dirname, cesiumSource)
      }
    },
    plugins: [
      new CopyWebpackPlugin([{
        from: path.join(cesiumSource, cesiumWorkers),
        to: 'Workers'
      }]),
      new CopyWebpackPlugin([{
        from: path.join(cesiumSource, 'Assets'),
        to: 'Assets'
      }]),
      new CopyWebpackPlugin([{
        from: path.join(cesiumSource, 'Widgets'),
        to: 'Widgets'
      }]),
      new CopyWebpackPlugin([{
        from: path.join(cesiumSource, 'ThirdParty/Workers'),
        to: 'ThirdParty/Workers'
      }]),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./')
      })
    ],
    module: {
      unknownContextCritical: /^.\/.*$/,
      unknownContextCritical: false

    }
  }
}