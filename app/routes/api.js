/*
 * Serve JSON to our AngularJS client
 */
module.exports = function(app) {
  // JSON API
  app.get('/api/name', name);
}

var name = function (req, res) {
  res.json({
    name: 'Bob'
  });
};
