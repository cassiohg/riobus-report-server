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
app.get('/', function (req, res, next) {
	// var newPerson = new Person(newPersonID)

	res.json({'metrica1': {'descricao': 'quantidade de onibus a cima da velocidade permitida', 
						  'valor': 292}
	
	})
});