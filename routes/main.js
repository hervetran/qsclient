/* API routes */
module.exports = function(app) {

  var auth = require('../controllers/auth')(app)
    , main = require('../controllers/main')(app);

  app.get('/', checkLogin, main.get_index);

  app.get('/login', auth.getLogin);
  app.post('/login', auth.postLogin);
  app.get('/signup', auth.getSignup);
  app.post('/signup', auth.postSignup);

  app.get('/logout', checkLogin, auth.getLogout);

  function checkLogin(req, res, next) {
    if (
      typeof req.session !== 'undefined' &&
      typeof req.session.user !== 'undefined' &&
      typeof req.session.user.access_token !== 'undefined'
    ) {
      return next();
    }

    res.redirect("/login");
  }

};
