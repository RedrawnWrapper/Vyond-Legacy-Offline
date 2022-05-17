const loadPost = require('../request/post_body');
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
