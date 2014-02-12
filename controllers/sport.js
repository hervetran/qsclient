module.exports = function(app) {

  var Validator = require('../lib/validator.js').Validator
    , API = require('../lib/api.js').API;

  this.getSports = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.get('/users/'+req.session.user.code+'/sports?access_token='+req.session.user.access_token, function (dataSports) {

      dataSports = JSON.parse(dataSports);

      if(typeof dataSports.error !== 'undefined') {
        return res.json(500, dataSports);
      }

      res.render('pages/sport', {
        locals: {
          host: app.get('app-host'),
          session: req.session,
          pageInfos: {
            id: 'page-sport',
            class: '',
            title: 'QSClient - Sport'
          },
          sports: dataSports
        }
      });

    });

  };

  this.postSport = function(req, res, next) {

    new Validator(defineValidators(req), function (err, errMsg) {

      var sport = req.body.sport;

      if(err) {
        res.json(500, { error: 'You must provide : ' + errMsg });
        return false;
      }

      var dataToSend = {
        type: sport.type,
        duration: sport.duration,
        date: formToDate(sport.date, sport.time)
      };

      var apiCall = new API(req);
      apiCall.post('/users/'+req.session.user.code+'/sports?access_token='+req.session.user.access_token, dataToSend, function (dataSports) {

        dataSports = JSON.parse(dataSports);

        if(typeof dataSports.error !== 'undefined') {
          return res.json(500, dataSports);
        }

        res.render('templates/sport', {
          locals: {
            host: app.get('app-host'),
            session: req.session,
            pageInfos: {
              id: 'page-sport',
              class: '',
              title: 'QSClient - Sport'
            },
            sports: [dataSports]
          }
        });

      });

    });

    function defineValidators(req) {
      var sport = req.body.sport;
      return [
        {
          str: req.body.sport.type,
          msg: ' a valid type value',
          method: 'notEmpty()'
        }, {
          str: req.body.sport.duration,
          msg: ' a valid duration value',
          method: 'isDecimal()'
        }, {
          str: formToDate(sport.date, sport.time),
          msg: ' a valid date',
          method: 'isDate()'
        }
      ];
    }

  };

  this.deleteSport = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.delete('/users/'+req.session.user.code+'/sports/'+req.params.sportId+'?access_token='+req.session.user.access_token, function (dataSports) {

      dataSports = JSON.parse(dataSports);

      if(typeof dataSports.error !== 'undefined') {
        return res.json(500, dataSports);
      }

      res.json(200, dataSports);

    });

  };

  function formToDate(date, time) {
    var dateValues = date.split('/');
    var timeValues = time.split(':');
    var isAfternoon = timeValues[1].split(' ')[1] == 'PM';
    timeValues[1] = timeValues[1].split(' ')[0];
    var date = new Date(parseInt(dateValues[2], 10), parseInt(dateValues[0], 10) - 1, parseInt(dateValues[1], 10));
    date.setHours(parseInt(timeValues[0], 10) + (isAfternoon ? 12 : 0));
    date.setMinutes(parseInt(timeValues[1], 10));
    date.setSeconds(0);
    return date;
  }

  return this;

};
