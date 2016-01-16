var fs = require('fs');

var filename = "thetas.json"

var thetas = JSON.stringify({ t0: 0, t1: 0 }, null, 4);

fs.writeFile(filename, thetas, function(err){
	if (err){
		return console.log(err);
	}
	console.log("Thetas saved in " + __dirname + "/" + filename);
});