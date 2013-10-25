var http = require('http');
var https = require('https');
var EventEmitter = require('events').EventEmitter;

http.createClient = function (port, host, secure) {
  var module = secure ? https : http;
  var client = new EventEmitter();
  var options = {
    port:port,
    host:host
  };
  client.request = function (method, path, headers) {
    var request = new EventEmitter();
    options.method = method;
    options.path = path;
    options.headers = headers
    var request = module.request(options, function (response) {
    });
    return request;
  };
  return client;
};

var API = function (req, options) {

  this.options = options || {
    format:'html',
    api_url:'localhost',
    api_port:3000,
    api_path:'',
    api_secure:false,
    token:null
  };

  this.options.debug = false;
};

API.prototype.get = function (what, callback) {
  var self = this;
  if (!what) {
    return callback(self.customError('error', 400));
  }

  what = handleToken(this, what);

  var path = this.options.api_path + what;

  var server = http.createClient(this.options.api_port, this.options.api_url, this.options.api_secure);

  var r = {'host':this.options.api_url};

  if(typeof this.options.channel !== 'undefined') {
    r["X-Channel"] = this.options.channel.id;
  }
  if(typeof this.options.page !== 'undefined') {
    r["X-Page"] = this.options.page.id;
  }

  if(this.options.debug) {
    try {
      throw new Error('qsapi::API');
    } catch (err) {
      var arr = err.stack.split('\n');
      arr = arr.splice(2);
      var toSend = [];
      for (var i=0;i<arr.length;i++) {
        if(arr[i].match(new RegExp(/\(\//))) {
          toSend.push(arr[i]);
        }

      }
      r["X-Debug"] = JSON.stringify(toSend);
    }
  }

  var request = server.request('GET', path, r);

  request.end();

  request.on('response', function (response) {
    var data = [];

    response.setEncoding('utf8');

    if (response.headers.location && response.headers.location.indexOf('?code=') > -1) {
      data.push(response.headers.location.split('?')[1]);
    }

    response.on('data', function (chunk) {
      data.push(chunk);
    });

    response.on('end', function () {
      return callback(data.join(''));
    });

  });

  request.on('error', function (e) {
    return callback(self.customError(e, 500));
  });

};

API.prototype.getWithoutToken = function (what, callback) {
  var self = this;

  if (!what) {
    return callback('error');
  }

  var path = this.options.api_path + what;

  var server = http.createClient(this.options.api_port, this.options.api_url, this.options.api_secure);
  var request = server.request('GET', path, {'host':this.options.api_url});

  request.end();

  request.on('response', function (response) {
    var data = [];

    response.setEncoding('utf8');

    if (response.headers.location && response.headers.location.indexOf('?code=') > -1) {
      data.push(response.headers.location.split('?')[1]);
    }

    response.on('data', function (chunk) {
      data.push(chunk);
    });
    response.on('end', function () {
      return callback(data.join(''));
    });
  });

  request.on('error', function (e) {
    console.log('\n\n');
    console.log("API ERROR CALL");
    console.log(e);
    console.log('\n\n');
    return callback(self.customError(e, 500));
  });
};

API.prototype.post = function (what, values, callback) {

  var self = this;
  var post = JSON.stringify(values);

  what = handleToken(this, what);

  var path = this.options.api_path + what;
  var server = http.createClient(this.options.api_port, this.options.api_url, this.options.api_secure);

  var r = {
    'host':this.options.api_url,
    'Content-Type':'application/json'
  };

  if(typeof this.options.channel !== 'undefined') {
    r["X-Channel"] = this.options.channel.id;
  }
  if(typeof this.options.page !== 'undefined') {
    r["X-Page"] = this.options.page.id;
  }

  var request = server.request('POST', path, r);
  request.write(post);
  request.end();

  request.on('response', function (response) {
    var data = [];

    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      data.push(chunk);
    });
    response.on('end', function () {
      return callback(data.join(''));
    });
  });

  request.on('error', function (e) {
    console.log('\n\n');
    console.log("API ERROR CALL");
    console.log(e);
    console.log('\n\n');
    return callback(self.customError(e, 500));
  });
};

API.prototype.put = function (what, values, callback) {
  var post = JSON.stringify(values);

  what = handleToken(this, what);

  var path = this.options.api_path + what;

  var server = http.createClient(this.options.api_port, this.options.api_url, this.options.api_secure);

  var r = {
    'host':this.options.api_url,
    'Content-Type':'application/json'
  };

  if(typeof this.options.channel !== 'undefined') {
    r["X-Channel"] = this.options.channel.id;
  }
  if(typeof this.options.page !== 'undefined') {
    r["X-Page"] = this.options.page.id;
  }
  var request = server.request('PUT', path, r);

  request.write(post);
  request.end();

  request.on('response', function (response) {
    var data = [];

    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      data.push(chunk);
    });
    response.on('end', function () {
      return callback(data.join(''));
    });
  });

  request.on('error', function (e) {
    console.log('\n\n');
    console.log("API ERROR CALL");
    console.log(e);
    console.log('\n\n');
  });
};

API.prototype.delete = function (what, callback) {
  if (!what) {
    return callback('error');
  }

  what = handleToken(this, what);

  var path = this.options.api_path + what;

  var server = http.createClient(this.options.api_port, this.options.api_url, this.options.api_secure);

  var r = {'host':this.options.api_url};

  if(typeof this.options.channel !== 'undefined') {
    r["X-Channel"] = this.options.channel.id;
  }
  if(typeof this.options.page !== 'undefined') {
    r["X-Page"] = this.options.page.id;
  }
  var request = server.request('DELETE', path, r);

  request.end();

  request.on('response', function (response) {
    var data = [];

    response.setEncoding('utf8');

    if (response.headers.location && response.headers.location.indexOf('?code=') > -1) {
      data.push(response.headers.location.split('?')[1]);
    }

    response.on('data', function (chunk) {
      data.push(chunk);
    });
    response.on('end', function () {
      return callback(data.join(''));
    });
  });

  request.on('error', function (e) {
    console.log('\n\n');
    console.log("API ERROR CALL");
    console.log(e);
    console.log('\n\n');
  });
};


API.prototype.customError = function (e, code) {

  var error = {
    code : code,
    msgs : [e]
  };
  switch (code) {
    case 503 :
      error.status = "Service not avalaible";
      break;

    case 400 :
      error.status = "Invalid request";
      break;

    default  :
      error.code = 500;
      error.status = 'Internal Server Error';
      break;
  }

  return JSON.stringify(error);

}

function handleToken(API, what) {

  if (typeof API.options.token !== 'undefined' && API.options.token !== null) {
    if (what.indexOf('?') > -1) {
      what = what + '&access_token=' + API.options.token;
    } else {
      what = what + '?access_token=' + API.options.token;
    }
  }

  return what;
}

module.exports.API = API;
