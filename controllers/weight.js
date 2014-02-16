module.exports = function(app) {

  var Validator = require('../lib/validator.js').Validator
    , API = require('../lib/api.js').API
    , Util = require('../lib/util.js');

  this.getWeights = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.get('/users/'+req.session.user.code+'/weights?access_token='+req.session.user.access_token, function (dataWeights) {

      dataWeights = JSON.parse(dataWeights);

      if(typeof dataWeights.error !== 'undefined') {
        return res.json(500, dataWeights);
      }

      res.render('pages/weight', {
        locals: {
          host: app.get('app-host'),
          session: req.session,
          pageInfos: {
            id: 'page-weight',
            class: '',
            title: 'QSClient - Weight'
          },
          weights: dataWeights
        }
      });

    });

  };

  this.postWeight = function(req, res, next) {

    new Validator(defineValidators(req), function (err, errMsg) {

      var weight = req.body.weight;

      if(err) {
        res.json(500, { error: 'You must provide : ' + errMsg });
        return false;
      }

      var dataToSend = {
        value: weight.value,
        unit: weight.unit,
        date: Util.formToDate(weight.date, weight.time)
      };

      var apiCall = new API(req);
      apiCall.post('/users/'+req.session.user.code+'/weights?access_token='+req.session.user.access_token, dataToSend, function (dataWeights) {

        dataWeights = JSON.parse(dataWeights);

        if(typeof dataWeights.error !== 'undefined') {
          return res.json(500, dataWeights);
        }

        res.render('templates/weight', {
          locals: {
            host: app.get('app-host'),
            session: req.session,
            pageInfos: {
              id: 'page-weight',
              class: '',
              title: 'QSClient - Weight'
            },
            weights: [dataWeights]
          }
        });

      });

    });

    function defineValidators(req) {
      var weight = req.body.weight;
      return [
        {
          str: weight.value,
          msg: ' a valid weight value',
          method: 'isDecimal()'
        },
        {
          str: weight.unit,
          msg: ' an valid weight unit type',
          method: 'notNull()'
        },
        {
          str: Util.formToDate(weight.date, weight.time),
          msg: ' an valid date',
          method: 'isDate()'
        }
      ];
    }

  };

  this.deleteWeight = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.delete('/users/'+req.session.user.code+'/weights/'+req.params.weightId+'?access_token='+req.session.user.access_token, function (dataWeights) {

      dataWeights = JSON.parse(dataWeights);

      if(typeof dataWeights.error !== 'undefined') {
        return res.json(500, dataWeights);
      }

      res.json(200, dataWeights);

    });

  };

  return this;

};
