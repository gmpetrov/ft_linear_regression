var fs = require('fs');
var prompt = require('prompt');

var filename = "thetas.json"

fs.readFile(filename, 'utf8', (err, data) => {

  if (err) throw err;

  var thetas = JSON.parse(data);

  console.log(thetas);

  console.log("--- Shitty car price predictor ---");
  console.log("Give me a mileage, i'll give you a price ...");

  // Launch prompt
  prompt.start();

  prompt.get(["mileage"], (err, res) => {
  	if (err) return console.log(err);

 	var price = hypothesis(res.mileage, thetas.t0, thetas.t1);

  	console.log(price);
  })
});

function hypothesis(x, t0, t1){
	return t0 + (t1 * x);
}