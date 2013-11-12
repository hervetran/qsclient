module.exports = function(app) {

  var Validator = require('../lib/validator.js').Validator
    , API = require('../lib/api.js').API;

  this.getSettings = function(req, res, next) {
    res.render('account/settings', {
      locals: {
        host: app.get('app-host'),
        session: req.session,
        pageInfos: {
          id: 'page-settings',
          class: '',
          title: 'QSClient - Settings'
        }
      }
    });
  };

  this.postSettings = function(req, res, next) {

    new Validator(defineValidators(req), function (err, errMsg) {

      var user = req.body.user;

      if(err) {
        res.render('account/settings', {
          locals: {
            host: app.get('app-host'),
            session: req.session,
            pageInfos: {
              id: 'page-settings',
              class: '',
              title: 'QSClient - Settings'
            },
            message: { error: 'You must provide : ' + errMsg }
          }
        });
        return false;
      }

      var dataToSend = {
        username: user.username,
        password: user.password,
        email: user.email
      };

      var apiCall = new API(req);
      apiCall.put('/users/'+req.session.user.code+'?access_token='+req.session.user.access_token, dataToSend, function (dataUser) {

        dataUser = JSON.parse(dataUser);

        if(typeof dataUser.error !== 'undefined') {
          return res.json(500, dataUser);
        }

        req.session.regenerate(function() {
          req.session.user = dataUser;
          res.render('account/settings', {
            locals: {
              host: app.get('app-host'),
              session: req.session,
              pageInfos: {
                id: 'page-settings',
                class: '',
                title: 'QSClient - Settings'
              },
              message: { success: 'Your settings has been updated.'}
            }
          });
        });

      });

    });

    function defineValidators(req) {
      return [
        {str: req.body.user.email, msg: ' a valid email address', method: 'isEmail()'},
        {str: req.body.user.username, msg: ' a username', method: 'notNull()'},
        {str: req.body.user.password, msg: ' a password', method: 'notNull()'},
        {str: req.body.user.password_confirmation, msg: ' a password confirmation', method: 'notNull()'},
        {str: [req.body.user.password, req.body.user.password_confirmation], msg: ' matching passwords'}
      ];
    }

  };

  this.deleteAccount = function(req, res, next) {
    // TODO
    delete req.session.user;
    res.redirect('/login');
  };

  return this;

};
