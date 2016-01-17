var express = require('express');
var app = express();
var fs = require('fs');
var csv = require('csv-parser');
var open = require('open');

app.set('view engine', 'ejs');

app.use(express.static("views"));

fs.readFile('thetas.json', 'utf8', (err, data) => {

	if (err) throw err;

	app.get('/', function(req, res) {

		// Array that will contains the csv dataset
		var points = [];

		fs.createReadStream('data.csv')
			.pipe(csv())
			.on('data', function(data) {

				points.push({ x : parseInt(data.km), y : parseInt(data.price) });

			})
			.on('end', function(){

				// Read the file containing the theta's
				var data = fs.readFileSync("thetas.json", 'utf8');

				// Get the thetas
				var thetas = JSON.parse(data);

				var ar = [];

				// get the x set
				for (var i = 0; i < points.length; i++){ ar.push(points[i].x); }

				// get min and max values of the set
				var minMaxValues = getMinMax(ar);
				var min = minMaxValues.min;
				var max = minMaxValues.max;

				// create object containing datas for rendering the regression line
				var regeressionPoints = { 'x0' : min, 'y0' : hypothesis(min, thetas.t0, thetas.t1), 'x1' : max, 'y1' : hypothesis(max, thetas.t0, thetas.t1) }

				// Render the page
				res.render('index', { 'data': { 'points' : points, 'regressionPoints' : regeressionPoints } });

			});
	});

	app.listen(4200);

	console.log('Server running at http://127.0.0.1:4200/');

	open("http://127.0.0.1:4200");

});

// Estimation function
function hypothesis(x, t0, t1){
	return t0 + (t1 * x);
}

// Return an array containing all values between a and b
function range(a, b){

	if (a >= b) { throw "Fuck"; }

	var ar = [];

	for (var i = a; i <= b; i++){ ar.push(i); }

	return ar;
}

// get min and max value from a given array
function getMinMax(ar){

	if (ar.length < 1) { throw "Empty array"; }

	var min = ar[0];
	var max = ar[0];

	for (var i = 0; i < ar.length; i++){
		if (ar[i] < min){ min = ar[i]; }

		if (ar[i] > max) { max = ar[i] }
	}

	return { 'min' : min, 'max' : max };
}