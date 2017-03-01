const app = require('express')(),
      proxy = require('express-http-proxy');

app.use('/', proxy("arte.pa.hubee.lan/api", {
    decorateRequest: function(proxyReq, originalReq) {
      // proxyReq.headers["x-api-key"] = "10315fe160f8b4efdedf25762e4cb2c55e9e9da5";
      console.log(proxyReq);
      return proxyReq;
    }
}));

app.listen(3000, function() {
    console.log('%s: Node server started on %d ...', Date(Date.now()), 3000);
});
