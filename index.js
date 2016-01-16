var express = require('express');
var app = express();
var fs = require('fs');
var csv = require('csv-parser');
var open = require('open');

app.set('view engine', 'ejs');

app.use(express.static("views"));

fs.readFile('thetas.json', 'utf8', (err, data) => {
	if (err) throw err;

	var thetas = JSON.parse(data);
	console.log("THETAS : ", thetas);

	var t0 = parseFloat(thetas.t0);
	var t1 = parseFloat(thetas.t1);

	var regression = [];

	var data = {
		labels : [],
			datasets : [
		{
			fillColor : "rgba(172,194,132,0)",
			strokeColor : "rgba(67, 76, 43, 0)",
			pointColor : "#fff",
			pointStrokeColor : "#9DB86D",
			data : []
		},
		{
			label : "Thetas",
			fillColor: "rgba(0, 0, 0, 0)",
			strokeColor: "#f00",
			data : regression
		}
	]
	};

	app.get('/', function(req, res) {

		var labels = [];
		var values = [];

		fs.createReadStream('data.csv')
			.pipe(csv())
			.on('data', function(data) {
				//console.log('row', data);
				labels.push(data.km.toString());
				values.push(data.price);
			})
			.on('end', function(){
				data.labels = labels.sort(function(a, b){ return a - b; }).reverse();
				data.datasets[0].data = values.sort(function(a, b){ return a - b; }).reverse();

				for (var i = 0; i < data.labels.length; i++){
					regression.push(hypothesis(data.labels[i], t0, t1));
				}

				res.render('index', { data: data });
			});
	});

	app.listen(4200);

	console.log('Server running at http://127.0.0.1:4200/');

	open("http://127.0.0.1:4200");

});

function hypothesis(x, t0, t1){
	return t0 + (t1 * x);
}