
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

/*
exports.remy = function(req, res){
	res.send();
}
*/