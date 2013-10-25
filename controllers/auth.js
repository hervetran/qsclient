module.exports = function(app) {

  var Validator = require('../lib/validator.js').Validator
    , API = require('../lib/api.js').API;

  this.get_login = function(req, res, next) {
    if (typeof req.session !== 'undefined' && typeof req.session.user !== 'undefined') {

      res.redirect("/");

    } else {

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

    }
  };

  this.post_login = function(req, res, next) {

    if (typeof req.session !== 'undefined' && typeof req.session.user !== 'undefined') {

      res.redirect("/");

    } else {

      var dataToSend = {
        username : req.body.user.name,
        password : req.body.user.password
      };

      var apiCall = new API(req);
      apiCall.post('/auth', dataToSend, function (dataUser) {

        dataUser = JSON.parse(dataUser);

        if(typeof dataUser.error !== 'undefined'){

          res.render('auth/login', {
            locals : {
              host : app.get('app-host'),
              session: req.session,
              pageInfos: {
                id: 'page-login',
                class: '',
                title: 'QSClient - Login'
              }
            },
            error: 'API message : '+dataUser.error
          });

        } else {

          req.session.regenerate(function(){
            req.session.user =  dataUser;
            res.redirect('/');
          });

        }

      });

    }

  };

  this.get_signup = function(req, res, next) {

    if (typeof req.session !== 'undefined' && typeof req.session.user !== 'undefined' && typeof req.session.user.access_token !=='undefined') {

      res.redirect("/");

    } else {

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

    }

  };

  this.post_signup = function(req, res, next) {

    if (typeof req.session !== 'undefined' && typeof req.session.user !== 'undefined' && typeof req.session.user.access_token !=='undefined') {

      res.redirect("/");

    } else {

      new Validator([
        {str:req.body.user.email, msg:' a valid email address', method:'isEmail()'},
        {str:req.body.user.name, msg:' a username', method:'notNull()'},
        {str:req.body.user.password, msg:' a password', method:'notNull()'},
        {str:req.body.user.password_confirmation, msg:' a password confirmation', method:'notNull()'},
        {str:[req.body.user.password, req.body.user.password_confirmation], msg:' matching passwords'}
      ], function (err, errMsg) {

        if (err) {
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
            user:req.body.user,
            error: 'You must provide : ' + errMsg
          });
          return false;
        }

        var dataToSend = {
          username : req.body.user.name,
          password : req.body.user.password,
          email : req.body.user.email
        };

        var apiCall = new API(req);
        apiCall.post('/users', dataToSend, function (dataUser) {

          dataUser = JSON.parse(dataUser);

          if(typeof dataUser.error !== 'undefined'){

            res.json(500, dataUser);

          } else {
            res.render('auth/confirm', {
              locals : {
                host : app.get('app-host'),
                session: req.session,
                pageInfos: {
                  id: 'page-confirm',
                  class: '',
                  title: 'QSClient - Signup'
                }
              },
              user: dataUser
            });
          }
        });

      });

    }

  };

  this.get_logout = function(req, res, next) {

    delete req.session.user;
    res.redirect('/login');

  };

  return this;

};
