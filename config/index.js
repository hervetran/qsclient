module.exports = function(app, express) {

  app.configure('development', function() {
    require("./development.js")(app, express);
  });

  /*production.configure('production', function() {
    require("./production.js")(app, express);
  });*/

};