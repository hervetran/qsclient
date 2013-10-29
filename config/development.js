module.exports = function(app, express) {

  app.set('app-salt', 'hNqDA3RqdK5Cq73d');
  app.set('api-host', 'http://localhost:3000');
  app.set('app-host', 'http://localhost:' + app.get('port'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  console.log('\n\x1b[33mEnvironment: development');
};