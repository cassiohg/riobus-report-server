var exec = require('child_process').exec
var fs = require ('fs')
var express = require('express');
var app = express();

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('riobus report server at http://%s:%s', host, port);

});

app.use('/', function (req, res, next) {
	console.log(' - a request has arrived:', req.originalUrl);
	next();
});

// our rest method
app.get('/speedLimit/:speed/:dateBeggin/:dateEnd/:xrec/:yrec/:xlength/:yheight', function (req, res, next) {
	
	var concatenatedParams = ""

	if( parseFloat(req.params.speed) && parseFloat(req.params.xrec) && parseFloat(req.params.yrect) &&
	parseFloat(req.params.xlength) && parseFloat(req.params.yheight) ) {
		console.log('oops')
		res.json({'info':'one paramter could not be converted to float.'})
		return
	} else {
		for (var key in req.params)
			concatenatedParams += " " + req.params[key]
	}

	// reading paths from file. This file makes changing path easier when moving code to another machine.
	paths = JSON.parse(fs.readFileSync(__dirname + "/paths.json"));
		
	// command that will be used on command line. 
	// better explained here https://spark.apache.org/docs/1.3.1/submitting-applications.html
	var command = paths.submit + " " + 
				  // '--master local[*] ' +
				  // '--master spark://cassios-mac.lan:7077 ' +
				  // '--deploy-mode cluster ' + 
				  paths.jar +
				  concatenatedParams // passing arguments to spark. 'concatenatedParams' starts with a space character.
	console.log(command)
	console.log(paths)

	// calling command execution.
	var spark = exec(command, function (error, stdout, stderr) {
		console.log('stdout: ' + stdout); // will print the output on console.
		console.log('stderr: ' + stderr); // print error on console.
		if (error !== null) console.log('node received this error: ' + error);

		// after the end of execution, we will read the result file.
		fs.readFile('/Users/cassiohg/Coding/Scala/riobus-report/result/speedLimit-result.txt', 'utf8',function (err, data) {
			if (err) throw err; 

			var lines = data.split("\n") // file content is returned as one string block, we are spliting it into lines.
			var obj = {} // an object that will hold all the information to be converted to JSON and sent on response.
			obj.description = 'quantidade de onibus a cima da velocidade permitida' // a simple description to be sent.
			obj.arguments = lines[0].split(',') // the argument we have used to calculate our result.
			obj.size = lines[1] // the total amount of positive results found.
			obj.sample = [] // an array that will hold a sample of the results.
			for (var i = 2; i < lines.length - 1; i++) { //starting from the second line
				obj.sample.push(lines[i].split(',')) // push line, converted to array, into sample array.
			}

			res.json(obj) // sending object, converted to JSON, on response. this is why I have put everything inside
						  // one object. This call converts an object to JSON and sends it in the response.
		})
	});
	
});

// serving static files on this server. this is here to serve html, css , javascript.
app.use(express.static('public'));