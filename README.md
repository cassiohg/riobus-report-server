# riobus-report-server

<h6>you need nodejs 6.0+ installed</h6>
<ol>
    <li>clone repository</li>
    <li>cd to project folder <br>
    <code>$ cd path/to/project</code></li>
    <li>install dependencies with npm <br>
    <code>$ npm install</code></li>
    <li>run app<br>
    <code>$ node index.js</code><br>
    server will listen on port 3000</li>
</ol>

<h6>now you need to create a file called 'paths.json' in the project's root directory</h6>
file should look like this

    {
        "submit": "/usr/local/spark-1.6.1-bin-hadoop2.4/bin/spark-submit",
        "jobs": {
            "topSpeed": {
                "class": "TopSpeed",
                "jar" : "/Users/cassiohg/Coding/Scala/riobus-report-top-speed/target/scala-2.10/topspeed_2.10-1.0.jar",
                "result": "/Users/cassiohg/Downloads/topSpeed-result.txt"
            },
            "averageSpeed": {
                "class": "AverageSpeed",
                "jar" : "/Users/cassiohg/Coding/Scala/riobus-report-average-speed/target/scala-2.10/averagespeed_2.10-1.0.jar",
                "result": "/Users/cassiohg/Downloads/averageSpeed-result.txt"
            },
            "busLineCount": {
                "class": "BusLineCount",
                "jar": "/Users/davidbrittojr/workspace/BigData/riobus-report/riobus-report-bus-line-count/target/scala-2.10/buslinecount_2.10-1.0.jar",
                "result":  "/Users/davidbrittojr/busLineCount-result.txt"
            }
        }
    }


* submit: the path to spark-submit file
* jobs: will contain an attribute (a tag) for each job, inside each attribute there will be an object with 3 attributes:
 * class: value is the class name for the main scala method.
 * jar: path to jobs's respective jars.
 * result: path to the output file that job will write to and server will read from.

this example file has 2 jobs listed. adding more jobs to the server's REST api means more attributes should be added to 'jobs' object.

you can change this file at anytime. the server will read the file again whenever a request in done to any of the job calls.

<br>
<h3>REST API functionalities</h3>

Return registers sample that are over a given speed limit inside a rectangle between a date interval

    method: GET
    path: /speedLimit/<dateBegin>/<dateEnd>/<lat1>/<lng1>/<lat2>/<lng2>/<speed>/<returnLength>
    successful return: {description: "blablabla", arguments: [a,b,c,e,d,f,g,h], size: total found, sample: [[register1], [register2], ...]}
    unsuccessful return: {info:'one or more parameters could not be converted to their correct type.', parameters: [wrong-parameter1, wrong-parameter2, ...]}

Return the amount of busses for each existing bus line inside a date interval

    method: GET
    path: /busLineCount/<dateBegin>/<dateEnd>
    successful return:  {description: "blablabla", arguments: [a,b], lines: [[line1, amount1], [line2, amount2], ...]}
    unsuccessful return: {info:'one or more parameters could not be converted to their correct type.', parameters: [wrong-parameter1, wrong-parameter2, ...]}

Get the average speed of all busses inside a rectangle between a date interval

    method: GET
    path: /averagespeed/<dateBegin>/<dateEnd>/<lat1>/<lng1>/<lat2>/<lng2>
    successful return:  {description: "blablabla", arguments: [a,b,c,d,e,f], result: <number>}
    unsuccessful return: {info:'one or more parameters could not be converted to their correct type.', parameters: [wrong-parameter1, wrong-parameter2, ...]}