/*
 * GET home page.
 */

module.exports = function(app) {
  app.get('/partials/:name', partials);

  // redirect all others to the index (HTML5 history)
  app.get('*', index);
};

var index = function(req, res){
  res.render('index');
};

var partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

