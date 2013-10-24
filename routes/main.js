/* API routes */
module.exports = function(app) {

  // User routes
  app.get('/', function(req,res,next){
    res.render('index');
  });

};
