module.exports = function(app, express) {

  app.set('app-salt', 'hNqDA3RqdK5Cq73d');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  console.log('\n\x1b[33mEnvironment: development');
};