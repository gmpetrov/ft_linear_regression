var express = require('express');
var app = express();
var fs = require('fs');
var csv = require('csv-parser');
var open = require('open');

app.set('view engine', 'ejs');

app.use(express.static("views"));

// Get csv data

var data = {
    labels : ["January","February","March","April","May","June"],
        datasets : [
    {
        fillColor : "rgba(172,194,132,0)",
        strokeColor : "#ACC26D",
        pointColor : "#fff",
        pointStrokeColor : "#9DB86D",
        data : [203,156,99,251,305,247]
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
            data.labels = labels.reverse();
            data.datasets[0].data = values.reverse();
            res.render('index', { data: data });
        });
});

app.listen(4200);

console.log('Server running at http://127.0.0.1:4200/');

open("http://127.0.0.1:4200");