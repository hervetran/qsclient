/* API routes */
module.exports = function(app) {

  var auth = require('../controllers/auth')(app)
    , main = require('../controllers/main')(app);

  app.get('/', checkLogin, main.get_index);

  app.get('/login', auth.get_login);
  app.post('/login', auth.post_login);
  app.get('/signup', auth.get_signup);
  app.post('/signup', auth.post_signup);

  app.get('/logout', checkLogin, auth.get_logout);

  function checkLogin (req, res, next) {
    if (typeof req.session !== 'undefined' && typeof req.session.user !== 'undefined' && typeof req.session.user.access_token !=='undefined') {
      next();
    } else {
      res.redirect("/login");
    }
  }

};
