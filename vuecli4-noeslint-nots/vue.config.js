var webpack = require('webpack');
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const name = '卓朗客户关系管理系统'
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: 8080,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        ws: false,
        // target: 'http://172.27.111.81:10010',
        // target: 'http://172.27.111.102:9090', //或ip或域名。
        // target: 'http://172.26.104.5:8080', //本地-hh
        // target: 'http://172.26.104.32:8088', //本地-wr
        //target: 'http://172.26.105.109:10010', ///后台联调
        // target: 'http://172.26.105.109:10010/',// hyl
        target: 'http://172.24.104.83:10000',//测试地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
  },

}