module.exports = function(app) {

  var Validator = require('../lib/validator.js').Validator
    , API = require('../lib/api.js').API
    , Util = require('../lib/util.js');

  this.getLocations = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.get('/users/'+req.session.user.code+'/locations?access_token='+req.session.user.access_token, function (dataLocations) {

      dataLocations = JSON.parse(dataLocations);

      if(typeof dataLocations.error !== 'undefined') {
        return res.json(500, dataLocations);
      }

      res.render('pages/location', {
        locals: {
          host: app.get('app-host'),
          session: req.session,
          pageInfos: {
            id: 'page-location',
            class: '',
            title: 'QSClient - Location'
          },
          locations: dataLocations
        }
      });

    });

  };

  this.postLocation = function(req, res, next) {

    new Validator(defineValidators(req), function (err, errMsg) {

      var location = req.body.location;

      if(err) {
        res.json(500, { error: 'You must provide : ' + errMsg });
        return false;
      }

      var dataToSend = {
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        date: Util.formToDate(location.date, location.time)
      };

      var apiCall = new API(req);
      apiCall.post('/users/'+req.session.user.code+'/locations?access_token='+req.session.user.access_token, dataToSend, function (dataLocations) {

        dataLocations = JSON.parse(dataLocations);

        if(typeof dataLocations.error !== 'undefined') {
          return res.json(500, dataLocations);
        }

        res.render('templates/location', {
          locals: {
            host: app.get('app-host'),
            session: req.session,
            pageInfos: {
              id: 'page-location',
              class: '',
              title: 'QSClient - Location'
            },
            locations: [dataLocations]
          }
        });

      });

    });

    function defineValidators(req) {
      var location = req.body.location;
      return [
        {
          str: location.name,
          msg: ' a valid name value',
          method: 'notEmpty()'
        }, {
          str: location.lat,
          msg: ' a valid latitude value',
          method: 'isDecimal()'
        }, {
          str: location.lng,
          msg: ' a valid longitude value',
          method: 'isDecimal()'
        }, {
          str: Util.formToDate(location.date, location.time),
          msg: ' a valid date',
          method: 'isDate()'
        }
      ];
    }

  };

  this.deleteLocation = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.delete('/users/'+req.session.user.code+'/locations/'+req.params.locationId+'?access_token='+req.session.user.access_token, function (dataLocations) {

      dataLocations = JSON.parse(dataLocations);

      if(typeof dataLocations.error !== 'undefined') {
        return res.json(500, dataLocations);
      }

      res.json(200, dataLocations);

    });

  };

  return this;

};
