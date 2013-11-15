module.exports = function(app) {

  var Validator = require('../lib/validator.js').Validator
    , API = require('../lib/api.js').API;

  this.getHeights = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.get('/users/'+req.session.user.code+'/heights?access_token='+req.session.user.access_token, function (dataHeights) {

      dataHeights = JSON.parse(dataHeights);

      if(typeof dataHeights.error !== 'undefined') {
        return res.json(500, dataHeights);
      }

      res.render('pages/height', {
        locals: {
          host: app.get('app-host'),
          session: req.session,
          pageInfos: {
            id: 'page-height',
            class: '',
            title: 'QSClient - Height'
          },
          heights: dataHeights
        }
      });

    });

  };

  this.postHeight = function(req, res, next) {

    new Validator(defineValidators(req), function (err, errMsg) {

      var height = req.body.height;

      if(err) {
        res.json(500, { error: 'You must provide : ' + errMsg });
        return false;
      }

      var dataToSend = {
        value: height.value,
        unit: height.unit
      };

      var apiCall = new API(req);
      apiCall.post('/users/'+req.session.user.code+'/heights?access_token='+req.session.user.access_token, dataToSend, function (dataHeights) {

        dataHeights = JSON.parse(dataHeights);

        if(typeof dataHeights.error !== 'undefined') {
          return res.json(500, dataHeights);
        }

        res.render('templates/height', {
          locals: {
            host: app.get('app-host'),
            session: req.session,
            pageInfos: {
              id: 'page-height',
              class: '',
              title: 'QSClient - Height'
            },
            heights: [dataHeights]
          }
        });

      });

    });

    function defineValidators(req) {
      return [
        {str: req.body.height.value, msg: ' a valid height value', method: 'isDecimal()'},
        {str: req.body.height.unit, msg: ' an valid height unit type', method: 'notNull()'}
      ];
    }

  };

  this.deleteHeight = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.delete('/users/'+req.session.user.code+'/heights/'+req.params.heightId+'?access_token='+req.session.user.access_token, function (dataHeights) {

      dataHeights = JSON.parse(dataHeights);

      if(typeof dataHeights.error !== 'undefined') {
        return res.json(500, dataHeights);
      }

      res.json(200, dataHeights);

    });

  };

  return this;

};
