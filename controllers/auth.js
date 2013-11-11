module.exports = function(app) {

  var Validator = require('../lib/validator.js').Validator
    , API = require('../lib/api.js').API;


  // GET /login

  this.getLogin = function(req, res, next) {
    if(typeof req.session !== 'undefined' && typeof req.session.user !== 'undefined') {
      return res.redirect('/');
    }

    res.render('auth/login', {
      locals : {
        host : app.get('app-host'),
        session: req.session,
        pageInfos: {
          id: 'page-login',
          class: '',
          title: 'QSClient - Login'
        }
      }
    });
  };


  // POST /login

  this.postLogin = function(req, res, next) {

    if(typeof req.session !== 'undefined' && typeof req.session.user !== 'undefined') {
      return res.redirect('/');
    }

    var user = req.body.user;
    var dataToSend = {
      username: user.name,
      password: user.password
    };

    var apiCall = new API(req);
    apiCall.post('/auth', dataToSend, function (dataUser) {

      dataUser = JSON.parse(dataUser);

      // Render login page if has error
      if(typeof dataUser.error !== 'undefined') {
        return res.render('auth/login', {
          locals: {
            host: app.get('app-host'),
            session: req.session,
            pageInfos: {
              id: 'page-login',
              class: '',
              title: 'QSClient - Login'
            }
          },
          error: 'API message : ' + dataUser.error
        });
      }

      req.session.regenerate(function() {
        req.session.user = dataUser;
        res.redirect('/');
      });

    });

  };


  // GET /signup

  this.getSignup = function(req, res, next) {

    if(
      typeof req.session !== 'undefined' &&
      typeof req.session.user !== 'undefined' &&
      typeof req.session.user.access_token !=='undefined'
    ) {
      return res.redirect('/');
    }

    res.render('auth/signup', {
      locals : {
        host : app.get('app-host'),
        session: req.session,
        pageInfos: {
          id: 'page-signup',
          class: '',
          title: 'QSClient - Signup'
        }
      }
    });

  };


  // POST /signup

  this.postSignup = function(req, res, next) {

    if(
      typeof req.session !== 'undefined' &&
      typeof req.session.user !== 'undefined' &&
      typeof req.session.user.access_token !== 'undefined'
    ) {
      return res.redirect('/');
    }

    new Validator(defineValidators(req), function (err, errMsg) {

      var user = req.body.user;

      if(err) {
        res.render('auth/signup', {
          locals : {
            host : app.get('app-host'),
            session: req.session,
            pageInfos: {
              id: 'page-signup',
              class: '',
              title: 'QSClient - Signup'
            }
          },
          user: user,
          error: 'You must provide : ' + errMsg
        });
        return false;
      }

      var dataToSend = {
        username: user.name,
        password: user.password,
        email: user.email
      };

      var apiCall = new API(req);
      apiCall.post('/users', dataToSend, function (dataUser) {

        dataUser = JSON.parse(dataUser);

        if(typeof dataUser.error !== 'undefined') {
          return res.json(500, dataUser);
        }

        res.render('auth/confirm', {
          locals: {
            host: app.get('app-host'),
            session: req.session,
            pageInfos: {
              id: 'page-confirm',
              class: '',
              title: 'QSClient - Signup'
            }
          },
          user: dataUser
        });

      });

    });

  };


  // GET /logout

  this.getLogout = function(req, res, next) {
    delete req.session.user;
    res.redirect('/login');
  };



  function defineValidators(req) {
    return [
      {str: req.body.user.email, msg: ' a valid email address', method: 'isEmail()'},
      {str: req.body.user.name, msg: ' a username', method: 'notNull()'},
      {str: req.body.user.password, msg: ' a password', method: 'notNull()'},
      {str: req.body.user.password_confirmation, msg: ' a password confirmation', method: 'notNull()'},
      {str: [req.body.user.password, req.body.user.password_confirmation], msg: ' matching passwords'}
    ];
  }


  return this;

};
