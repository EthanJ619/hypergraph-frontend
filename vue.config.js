const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    // 代理配置
    proxy: {

      '/api': {
        target: 'http://127.0.0.1:8186', // 我们要代理的地址
        // target: "http://10.16.85.149:8185",//连的胡双后台，数据表中有公共数据集节点
        changeOrigin: true,  // 是否跨域 需要设置此值为true 才可以让本地服务代理我们发出请求
        pathRewrite: {
          '^/api': ''
        }
      },
    },
    client: {
      overlay: false,
    }
  },
  // 调试工具
  configureWebpack: {
    devtool: 'source-map'
  }
})
