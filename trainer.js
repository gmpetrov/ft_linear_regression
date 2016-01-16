var fs = require('fs');

var filename = "thetas.json"

var thetas = JSON.stringify({ t0: 2, t1: 2 }, null, 4);

fs.writeFile(filename, thetas, function(err){
	if (err){
		return console.log(err);
	}
	console.log("Thetas saved in " + __dirname + "/" + filename);
});