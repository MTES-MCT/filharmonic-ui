module.exports = {
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        pathRewrite: {
          '^/api': ''
        },
        public: 'filharmonic.local.beta.gouv.fr:8080'
      }
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, authorization"
    }
  }
}
