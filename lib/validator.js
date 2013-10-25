/**
 *  YouMood.me
 **/

var Valid = require('validator').Validator;

var Validator = function(data, callback) {
  this.errors = false;
  this.errorsMsg = [];
  this.validator = new Valid();
  this.callback = callback;
  this.verify(data);
};

Validator.prototype.verify = function(data) {
  var self = this;
  data.forEach(function(data) {
    try {
      if (typeof data.str === 'object' && data.str.length) {
        if (data.str[0] != data.str[1]) {
          self.errorsMsg.push(data.msg);
          self.errors = true;
        }
      } else {
        eval('self.validator.check(data.str, data.msg).' + data.method + ';');
      }
    } catch (e) {
      self.errorsMsg.push(e.message);
      self.errors = true;
    }
  });
  if (this.errors) {
    this.callback('error', this.errorsMsg);
  } else {
    this.callback(null);
  }
};

module.exports.Validator = Validator;