var fs = require('fs');

var filename = "thetas.json"

fs.readFile(filename, 'utf8', (err, data) => {
  if (err) throw err;

  var thetas = JSON.parse(data);

  console.log(thetas);
});