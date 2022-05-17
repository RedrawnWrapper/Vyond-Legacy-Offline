const starter = require('./main');
module.exports = function (req, url) {
  if (req.method == "POST") {
    switch (url.pathname) {
      case "/goapi/deleteUserTemplate/": {
        starter.delete();
        return true;
      }
    }
  }
}
