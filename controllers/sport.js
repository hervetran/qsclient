module.exports = function(app) {

  var Validator = require('../lib/validator.js').Validator
    , API = require('../lib/api.js').API
    , _ = require('lodash')
    , Util = require('../lib/util.js');

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
          sports: dataSports,
          chart: JSON.stringify(toChart(dataSports)),
          pie: JSON.stringify(toPie(dataSports))
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
        date: Util.formToDate(sport.date, sport.time)
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
          str: sport.type,
          msg: ' a valid type value',
          method: 'notEmpty()'
        }, {
          str: sport.duration,
          msg: ' a valid duration value',
          method: 'isDecimal()'
        }, {
          str: Util.formToDate(sport.date, sport.time),
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

  function toChart(sports) {
    var arr = [];
    _.map(sports, function(sport) {
      var date = new Date(sport.date)
        , month = date.getMonth() + 1
        , type = sport.type;
      date.setDate(1);
      var stringDate = month + '/' + date.getDate() + '/' + date.getFullYear();
      var i = _.filter(_.map(arr, function(el, i) {
                                    if(el.date === stringDate) { return i; }
                                  }), function(el) {
                                        return el !== undefined;
                                      });
      if(i.length > 0) {
        var it = i[0];
        var value = arr[it][type] || 0;
        arr[it][type] = value + sport.duration;
      } else {
        var obj = { date: stringDate };
        obj[type] = sport.duration;
        arr.push(obj);
      }
    });
    return arr;
  }

  function toPie(sports) {
    var obj = {};
    _.map(sports, function(sport) {
      var type = sport.type;
      var objType = obj[type];
      var value = typeof objType !== 'undefined' ? objType.value : 0;
      value += sport.duration;
      obj[type] = {
        type: type,
        value: value
      };
    });
    return _.map(_.keys(obj), function(k) {
      return obj[k];
    });
  }

  return this;

};
