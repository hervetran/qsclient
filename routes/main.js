/* API routes */
module.exports = function(app) {

  var auth = require('../controllers/auth')(app)
    , index = require('../controllers/index')(app)
    , settings = require('../controllers/settings')(app)
    , weight = require('../controllers/weight')(app)
    , height = require('../controllers/height')(app)
    , sleep = require('../controllers/sleep')(app)
    , cigarette = require('../controllers/cigarette')(app);

  // Index
  app.get('/', checkLogin, index.getIndex);

  // Auth
  app.get('/login', auth.getLogin);
  app.post('/login', auth.postLogin);
  app.get('/signup', auth.getSignup);
  app.post('/signup', auth.postSignup);
  app.get('/logout', checkLogin, auth.getLogout);

  // Settings
  app.get('/account/settings', checkLogin, settings.getSettings);
  app.post('/account/settings', checkLogin, settings.postSettings);
  app.get('/account/delete', checkLogin, settings.deleteAccount);

  // Weight
  app.get('/weight', checkLogin, weight.getWeights);
  app.post('/weight', checkLogin, weight.postWeight);
  app.post('/weight/:weightId/delete', checkLogin, weight.deleteWeight);

  // Height
  app.get('/height', checkLogin, weight.getHeights);
  app.post('/height', checkLogin, weight.postHeight);
  app.post('/height/:heightId/delete', checkLogin, weight.deleteHeight);

  // Sleep
  app.get('/sleep', checkLogin, sleep.getSleeps);
  app.post('/sleep', checkLogin, sleep.postSleep);
  app.post('/sleep/:sleepId/delete', checkLogin, sleep.deleteSleep);

  // Cigarette
  app.get('/cigarette', checkLogin, cigarette.getCigarettes);
  app.post('/cigarette', checkLogin, cigarette.postCigarette);
  app.post('/cigarette/:cigaretteId/delete', checkLogin, cigarette.deleteCigarette);

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
