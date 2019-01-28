module.exports = {
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    host: 'filharmonic.local.beta.gouv.fr',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
