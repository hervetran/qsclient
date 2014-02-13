module.exports = function(app) {

  var Validator = require('../lib/validator.js').Validator
    , API = require('../lib/api.js').API;

  this.getDrinks = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.get('/users/' + req.session.user.code + '/drinks?access_token=' + req.session.user.access_token, function (dataDrinks) {

      dataDrinks = JSON.parse(dataDrinks);

      if(typeof dataDrinks.error !== 'undefined') {
        return res.json(500, dataDrinks);
      }

      res.render('pages/drink', {
        locals: {
          host: app.get('app-host'),
          session: req.session,
          pageInfos: {
            id: 'page-drink',
            class: '',
            title: 'QSClient - Drink'
          },
          drinks: dataDrinks
        }
      });

    });

  };

  this.postDrink = function(req, res, next) {

    new Validator(defineValidators(req), function (err, errMsg) {

      var drink = req.body.drink;

      if(err) {
        res.json(500, { error: 'You must provide : ' + errMsg });
        return false;
      }

      var dataToSend = {
        value: drink.value,
        unit: drink.unit
      };

      var apiCall = new API(req);
      apiCall.post('/users/' + req.session.user.code + '/drinks?access_token=' + req.session.user.access_token, dataToSend, function (dataDrinks) {

        dataDrinks = JSON.parse(dataDrinks);

        if(typeof dataDrinks.error !== 'undefined') {
          return res.json(500, dataDrinks);
        }

        res.render('templates/drink', {
          locals: {
            host: app.get('app-host'),
            session: req.session,
            pageInfos: {
              id: 'page-drink',
              class: '',
              title: 'QSClient - Drink'
            },
            drinks: [dataDrinks]
          }
        });

      });

    });

    function defineValidators(req) {
      return [
        {str: req.body.drink.value, msg: ' a valid drink value', method: 'isDecimal()'},
        {str: req.body.drink.unit, msg: ' an valid drink unit type', method: 'notNull()'}
      ];
    }

  };

  this.deleteDrink = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.delete('/users/'+req.session.user.code+'/drinks/'+req.params.drinkId+'?access_token='+req.session.user.access_token, function (dataDrinks) {

      dataDrinks = JSON.parse(dataDrinks);

      if(typeof dataDrinks.error !== 'undefined') {
        return res.json(500, dataDrinks);
      }

      res.json(200, dataDrinks);

    });

  };

  return this;

};
