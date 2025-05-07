// client/src/apiProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware('/api', {
  target: 'https://hellojakejohn.onrender.com',
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['access-control-allow-origin'] = 'https://www.hellojakejohn.com';
    proxyRes.headers['access-control-allow-credentials'] = 'true';
  }
});