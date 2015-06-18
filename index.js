var exec = require('child_process').exec
var fs = require ('fs')
var express = require('express');
var app = express();

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('riobus report server at http://%s:%s', host, port);

});

// respond with "Hello World!" on the homepage
app.use('/', function (req, res, next) {
	console.log(' - a request has arrived:', req.originalUrl);
	next();
});

// accept POST request on the homepage
app.get('/speedLimit', function (req, res, next) {
	// var newPerson = new Person(newPersonID)
	var command = '/usr/local/share/spark-1.3.1-bin-hadoop2.6/bin/spark-submit ' +
				  '--master local[*] ' +
				  '/Users/cassiohg/Coding/Scala/riobus-report/target/scala-2.10/riobus-report_2.10-1.0.jar'
	var spark = exec(command, function (error, stdout, stderr) {
		// console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}

		fs.readFile('/Users/cassiohg/Coding/Scala/riobus-report/result/speedLimit-result.txt', 'utf8', function (err, data) {
			if (err) throw err;
			res.json({'metrica1': {'description': 'quantidade de onibus a cima da velocidade permitida', 
						 			    'sample': data
						 		  }
		});
	});

	// res.json({'metrica1': {'description': 'quantidade de onibus a cima da velocidade permitida', 
	// 					  'sample': 292}
	
	})
});