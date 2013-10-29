module.exports = function(app) {

  this.get_index = function(req, res, next) {
    res.render('index', {
      locals: {
        host: app.get('app-host'),
        session: req.session,
        pageInfos: {
          id: 'page-index',
          'class': '',
          title: 'QSClient - Index'
        }
      }
    });
  };

  return this;

};
