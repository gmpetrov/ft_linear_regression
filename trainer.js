var fs = require('fs');
var csv = require('csv-parser');
var filename = "thetas.json"

try {

	// Read the file containing the trained thetas
	var data = fs.readFileSync("thetas.json", 'utf8');

	// Get the thetas
	var thetas = JSON.parse(data);

	// Get csv data, parse it and put it inside an array
	fs.createReadStream("data.csv")
    .pipe(csv())
    .on('data', function(data) {

        var mileage = parseFloat(data.km);
        var price   = parseFloat(data.price);

        Gradient.dataSet.push({ 'price' : price, 'mileage' : mileage });

    })
    .on('end', function(){

    	// Run gradien algo
    	var thetas = Gradient.algo();

    	// Save the trained theta
    	saveThetas(thetas);
    });

}
catch (e){
	console.log(e);
}

var Gradient = {

    dataSet : [],
	learningRate : 0.1,
	thetas : { 't0' : 0, 't1' : 0 },
    scale : 0,

    // Main function of the algo
	algo : function(){

    	var m = this.dataSet.length;
		var tmpT0 = 1;
    	var tmpT1 = 1;

    	this._featureScaling();

    	// While the thetas do not converge
		while(Math.abs(tmpT1) > 0.001 && Math.abs(tmpT0) > 0.001){

    		var sum0 = 0;
    		var sum1 = 0;

    		for (var i = 0; i < this.dataSet.length; i++){
    			sum0 += this._sumT0(i);
    			sum1 += this._sumT1(i);
    		}

    		tmpT0 = this.learningRate * (1 / m) * sum0;
    		tmpT1 = this.learningRate * (1 / m) * sum1;

    		// Sync previous thetas
    		this.thetas.t0 -= tmpT0;
    		this.thetas.t1 -= tmpT1;
    	}

    	// Scale down the slope
    	this.thetas.t1 = this.thetas.t1 / this.scale;

    	console.log("this.Thetas : ", this.thetas);

    	return this.thetas;
	},
	_estimate : function(x, t0, t1){
		return (t0 + (t1 * x));
	},
	_cost : function(x, y, t0, t1, data){

		var sum = 0;
		for (var i = 0; i < data.length; i++){
			sum += Math.pow((_estimate(x, t0, t1) - y), 2);
		}
		return (1 / 2) * (1 / data.length) * sum;
	},
	_featureScaling : function(){

		var X = [];

		// tmp array to play with Xs
		for (var i = 0; i < this.dataSet.length; i++){ X.push(this.dataSet[i].mileage); }

		var min = Math.min(...X);
		var max = Math.max(...X);

		this.scale = max - min;

		// Scale the Xs to speed up the algo
		for (var i = 0; i < this.dataSet.length; i++){
			this.dataSet[i].mileage = (this.dataSet[i].mileage - min) / this.scale;
		}
	},

	_sumT0 : function(index){
		return this._estimate(this.dataSet[index].mileage, this.thetas.t0, this.thetas.t1) - this.dataSet[index].price;
	},

	_sumT1 : function(index){
		return (this._estimate(this.dataSet[index].mileage, this.thetas.t0, this.thetas.t1) - this.dataSet[index].price) * this.dataSet[index].mileage;
	}

};


//	Save the trained thetas into a file in the current dir

function saveThetas(thetas){
	fs.writeFile(filename, JSON.stringify(thetas, null, 4), function(err){
		if (err){
			return console.log(err);
		}
		console.log("Thetas saved in " + __dirname + "/" + filename);
	});
}