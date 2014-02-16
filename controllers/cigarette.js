module.exports = function(app) {

  var Validator = require('../lib/validator.js').Validator
    , API = require('../lib/api.js').API
    , _ = require('lodash');

  this.getCigarettes = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.get('/users/'+req.session.user.code+'/cigarettes?access_token='+req.session.user.access_token, function (dataCigarettes) {

      dataCigarettes = JSON.parse(dataCigarettes);

      if(typeof dataCigarettes.error !== 'undefined') {
        return res.json(500, dataCigarettes);
      }

      res.render('pages/cigarette', {
        locals: {
          host: app.get('app-host'),
          session: req.session,
          pageInfos: {
            id: 'page-cigarette',
            class: '',
            title: 'QSClient - Cigarette'
          },
          cigarettes: dataCigarettes,
          chart: JSON.stringify(toChart(dataCigarettes))
        }
      });

    });

  };

  this.postCigarette = function(req, res, next) {

    new Validator(defineValidators(req), function (err, errMsg) {

      var cigarette = req.body.cigarette;

      if(err) {
        res.json(500, { error: 'You must provide : ' + errMsg });
        return false;
      }

      var dataToSend = {
        quantity: cigarette.quantity,
        date: formToDate(cigarette.date, cigarette.time)
      };

      var apiCall = new API(req);
      apiCall.post('/users/'+req.session.user.code+'/cigarettes?access_token='+req.session.user.access_token, dataToSend, function (dataCigarettes) {

        dataCigarettes = JSON.parse(dataCigarettes);

        if(typeof dataCigarettes.error !== 'undefined') {
          return res.json(500, dataCigarettes);
        }

        res.render('templates/cigarette', {
          locals: {
            host: app.get('app-host'),
            session: req.session,
            pageInfos: {
              id: 'page-cigarette',
              class: '',
              title: 'QSClient - Cigarette'
            },
            cigarettes: [dataCigarettes]
          }
        });

      });

    });

    function defineValidators(req) {
      var cigarette = req.body.cigarette;
      return [
        {
          str: cigarette.quantity,
          msg: ' a valid quantity value',
          method: 'isDecimal()'
        }, {
          str: formToDate(cigarette.date, cigarette.time),
          msg: ' an valid date',
          method: 'isDate()'
        }
      ];
    }

  };

  this.deleteCigarette = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.delete('/users/'+req.session.user.code+'/cigarettes/'+req.params.cigaretteId+'?access_token='+req.session.user.access_token, function (dataCigarettes) {

      dataCigarettes = JSON.parse(dataCigarettes);

      if(typeof dataCigarettes.error !== 'undefined') {
        return res.json(500, dataCigarettes);
      }

      res.json(200, dataCigarettes);

    });

  };

  function formToDate(date, time) {
    var dateValues = date.split('/');
    var timeValues = time.split(':');
    var isAfternoon = timeValues[1].split(' ')[1] === 'PM';
    timeValues[1] = timeValues[1].split(' ')[0];
    date = new Date(parseInt(dateValues[2], 10), parseInt(dateValues[0], 10) - 1, parseInt(dateValues[1], 10));
    date.setHours(parseInt(timeValues[0], 10) + (isAfternoon ? 12 : 0));
    date.setMinutes(parseInt(timeValues[1], 10));
    date.setSeconds(0);
    return date;
  }

  function toChart(cigarettes) {
      var arr = [];
      _.each(cigarettes, function(cigarette) {
          var date = new Date(cigarette.date);
          var obj = {
              date: (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear(),
              cigarettes: cigarette.quantity
          };
          arr.push(obj);
      });
    return arr;
  }

  return this;

};
