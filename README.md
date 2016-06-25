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