// call in function/library (this is written in JS, lower level is C)
var path = require('path');

console.log('step 1: file exists?');

// check exists with callback, could validate for argv[2] here (or try catch)
path.exists(process.argv[2], function (exists) {
	console.log('Exists? ' + exists);
});

console.log('setp 2: now we wait...');
