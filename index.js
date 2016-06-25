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
app.get('/speedLimit/:dateBegin/:dateEnd/:lat1/:lng1/:lat2/:lng2/:speed/:returnLength', function (req, res, next) {
	testParamsBuildCommandRunJobAndReturnResults(
		'topSpeed',  
		[req.params.dateBegin, req.params.dateEnd],
		[req.params.lat1, req.params.lng1, req.params.lat2, req.params.lng2, req.params.speed, req.params.returnLength],
		res, 
		function (err, data) {
			console.log(data)
			if (err) throw err; 
			var lines = data.split("\n") // file content is returned as one string block, we are splitting it into lines.
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
		}
	)

});

app.get('/averagespeed/:dateBegin/:dateEnd/:lat1/:lng1/:lat2/:lng2/', function (req, res, next) {
	testParamsBuildCommandRunJobAndReturnResults(
		'averageSpeed',  
		[req.params.dateBegin, req.params.dateEnd],
		[req.params.lat1, req.params.lng1, req.params.lat2, req.params.lng2],
		res, 
		function (err, data) {
			if (err) throw err; 
			var lines = data.split("\n") // file content is returned as one string block, we are splitting it into lines.
			var obj = {} // an object that will hold all the information to be converted to JSON and sent on response.
			obj.description = 'velocidade media dos onibus dentro da região' // a simple description to be sent.
			obj.arguments = lines[0].split(',') // the argument we have used to calculate our result.
			obj.result = Number(lines[1])
			res.json(obj) // sending object, converted to JSON, on response. this is why I have put everything inside
						  // one object. This call converts an object to JSON and sends it in the response.
		}
	)
});

/* this function will do it all, it just need the correct parameters, the jobTag as used in paths.json file and a function 
that will be the callback for the fs.readFile() function that will read the job's result file. */
function testParamsBuildCommandRunJobAndReturnResults(jobTag, dateParametersArray, numberParametersArray, res, resultFunction) {
	var unparsebleNumbers = testNumberParameters(numberParametersArray)
	var unparsebleDates = testDateParameters(dateParametersArray)
	if ( unparsebleNumbers.length > 0 || unparsebleDates.length > 0 ) {
		res.json({info:'one or more parameters could not be converted to their correct type.', 
		          parameters: unparsebleDates.concat(unparsebleNumbers)})
		return
	}

	// reading paths from file. This file makes changing path easier when moving code to another machine.
	var paths = JSON.parse(fs.readFileSync(__dirname + "/paths.json"));
	var concatenatedParams = " " + dateParametersArray.concat(numberParametersArray).join(" ")	

	// command that will be used on command line. 
	// better explained here https://spark.apache.org/docs/1.3.1/submitting-applications.html
	var command = paths.submit + " " + 
	              '--class '+ paths.class[jobTag] + " " + 
	              '--driver-memory 1536m ' +
	              '--master local[*] ' +
	              paths.jar[jobTag] + " " +
	              paths.result[jobTag] +
	              concatenatedParams // passing arguments to spark. 'concatenatedParams' starts with a space character.
	console.log("command", command)

	// calling command execution.
	var spark = exec(command, function (error, stdout, stderr) {
		console.log('stdout: ' + stdout); // will print the output on console.
		console.log('stderr: ' + stderr); // print error on console.
		if (error !== null) console.log('node received this error: ' + error);

		// after the end of execution, we will read the result file.
		fs.readFile(paths.result[jobTag], 'utf8',resultFunction)
	});
}

function testNumberParameters (numbers) {
	var unparsebleNumbers = []
	for (var i = 0; i < numbers.length; i++) {
		if ( isNaN(Number(numbers[i])) )
			unparsebleNumbers.push(numbers[i])
	}
	return unparsebleNumbers
}

function testDateParameters (dates) {
	var unparsebleDates = []
	for (var i = 0; i < dates.length; i++) {
		if ( isNaN(new Date(dates[i]).getTime()) )
			unparsebleDates.push(dates[i])
	}
	return unparsebleDates
}