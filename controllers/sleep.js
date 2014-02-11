module.exports = function(app) {

  var Validator = require('../lib/validator.js').Validator
    , API = require('../lib/api.js').API
    , _ = require('lodash');

  var Sleep = {};

  Sleep.getSleeps = function(req, res, next) {

    var apiCall = new API(req);
    apiCall.get(
      '/users/' + req.session.user.code + '/sleeps?access_token=' + req.session.user.access_token, function (dataSleeps) {

      dataSleeps = JSON.parse(dataSleeps);

      if(typeof dataSleeps.error !== 'undefined') {
        return res.json(500, dataSleeps);
      }

      res.render('pages/sleep', {
        locals: {
          host: app.get('app-host'),
          session: req.session,
          pageInfos: {
            id: 'page-sleep',
            class: '',
            title: 'QSClient - Sleep'
          },
          sleeps: dataSleeps,
          chart: sleepsToChart(dataSleeps)
        }
      });

    });

  };

  Sleep.postSleep = function(req, res, next) {

    new Validator(defineValidators(req), function (err, errMsg) {

      var sleep = req.body.sleep;

      if(err) {
        res.json(500, { error: 'You must provide : ' + errMsg });
        return false;
      }

      var dataToSend = {
        start: formToDate(sleep.start_date, sleep.start_time),
        end: formToDate(sleep.end_date, sleep.end_time)
      };

      var apiCall = new API(req);
      var user = req.session.user;
      apiCall.post('/users/' + user.code + '/sleeps?access_token=' + user.access_token, dataToSend, function (dataSleeps) {

        dataSleeps = JSON.parse(dataSleeps);

        if(typeof dataSleeps.error !== 'undefined') {
          return res.json(500, dataSleeps);
        }

        res.render('templates/sleep', {
          locals: {
            host: app.get('app-host'),
            session: req.session,
            pageInfos: {
              id: 'page-sleep',
              class: '',
              title: 'QSClient - Sleep'
            },
            sleeps: [dataSleeps]
          }
        });

      });

    });

    function defineValidators(req) {
      var sleep = req.body.sleep;
      return [
        {
          str: formToDate(sleep.start_date, sleep.start_time),
          msg: ' a valid sleep start date',
          method: 'isDate()'
        }, {
          str: formToDate(sleep.end_date, sleep.end_time),
          msg: ' an valid sleep end date',
          method: 'isDate()'
        }
      ];
    }

  };

  Sleep.deleteSleep = function(req, res, next) {

    var apiCall = new API(req);
    var user = req.session.user;
    var id = req.params.sleepId;
    apiCall['delete']('/users/' + user.code + '/sleeps/' + id + '?access_token=' + user.access_token, function (dataSleeps) {

      dataSleeps = JSON.parse(dataSleeps);

      if(typeof dataSleeps.error !== 'undefined') {
        return res.json(500, dataSleeps);
      }

      res.json(200, dataSleeps);

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

  function sleepsToChart(sleeps) {
    var values = [];
    _.map(sleeps, function(sleep) {
      var value = {},
          start = new Date(sleep.start),
          end = new Date(sleep.end);
      value.date = end.getFullYear() + '/' + end.getMonth() + '/' + end.getDate();
      value.minutes = diff(start, end);
      values.push(value);
    })

    function diff(start, end) {
      var diffMs = (end - start);
      return Math.round(diffMs / (1000 * 60));
    }

    return values;
  }

  return Sleep;

};
