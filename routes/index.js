
/*
 * GET home page.
 */

/* original code 
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
*/

exports.index = function (req, res) {
    res.sendfile('public/index.html');
};
