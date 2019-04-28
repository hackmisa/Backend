var Twit = require("twit");
var config = require("./config");
var T = new Twit(config);

var floodMap = new Map();
var fireMap = new Map();
var earthQuakeMap = new Map();
var irrelevantMap = new Map();


var params = {
	q: "flood",
	count: 10
};

var sanFrancisco = ["-122.75", "36.8", "-121.75", "37.8"];
//30.351449, -97.852871
//30.216850, -97.640237
var austin = ["-97.852871", "30.216850", "-97.640237", "30.351449"];

var stream = T.stream("statuses/filter", {locations: austin});
var obj = null;

stream.on("tweet", function(tweet) {
	// console.log(tweet);
	var imgurl;
	if (tweet.entities.media && tweet.entities.media.type == "photo") {
		console.log("here\n");
		imgurl = tweet.entities.media.media_url;
	}

	var point = [];
	if (tweet.geo) {
		point = tweet.geo.coordinates;
		//console.log("using geo: " + point);
		// return;
	} else if (tweet.place) {
		//try place
		var cords = tweet.place.bounding_box.coordinates[0];
		// console.log(cords);
		var area =
			Math.abs(cords[2][0] - cords[0][0]) *
			Math.abs(cords[2][1] - cords[0][1]);
		if (area > 0.2) {
			//console.log("too big buddy: " + cords);
			// return;
			point[1] = -97.741845 + Math.random() * 0.07;
			point[0] = 30.270299 + Math.random() * 0.07;
		}
		point[1] = 0.5 * (cords[2][0] + cords[0][0]);
		point[0] = 0.5 * (cords[2][1] + cords[0][1]);
		//console.log("using place: " + point);
	}

	var tweeturl =
		"https://twitter.com/" +
		tweet.user.screen_name +
		"/status/" +
		tweet.id_str;

	obj = {
		coordinates: point,
		url: tweeturl,
		imageUrl: imgurl,
		text: tweet.text,
		user: tweet.user.screen_name,
		tags: null
	};
	// console.log(tweet);
	sendTweet(obj);
	
	console.log("success");
	console.log(obj);
});

didStuff = false;


function sendTweet(obj) {
	if(obj.imageUrl == undefined){
		return;
	}
	obj.tags = getTags(obj);
	didStuff = true;
	//socket.emit("markers", obj)

}

// T.get("search/tweets", params, gotData);
//tweet url = quoted_status_permalink.url
function gotData(err, data, resp) {
	console.log(err);
	console.log(data);
}

function tweeted(err, data, response) {
	if (err) {
		console.log("something went wrong");
		console.log(err);
		console.log(config);
	} else {
		console.log("it worked");
	}
}

// #!/usr/bin/nodejs
var PythonShell = require("python-shell");
var express = require("express");
var bodyParser = require("body-parser");
var contentDisposition = require("content-disposition");
var destroy = require("destroy");
var child_process = require("child_process");
var onFinished = require("on-finished");
var fs = require("fs");
var path = require("path");
//var http = require('http').Server(app);
var fileUpload = require("express-fileupload");

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function (socket){
	var tweets = setInterval(function (){
		getTweet(function (tweet) {
			if(didStuff){
				socket.volatile.emit("markers", obj)
				didStuff = false;
			}
		});
	}, 100);

	socket.on('disconnect', function(){
		clearInterval(tweets)
	});
});


// -------------- express initialization -------------- //

// Here, we set the port (these settings are specific to our site)
server.listen(8080)
app.set("port", process.env.PORT || 8081);

function getTags(obj) {
	var url = obj.imageUrl;
	var location = obj.coordinates;
	const spawn = require("child_process").spawn;
	const pyFile = "c.py";
	const args = [url];
	args.unshift(pyFile);

	const pyspawn = spawn("python2", args);
	pyspawn.stdout.on("data", (data) => {
		console.log(`stdout: ${data}`);
		// res.send(data);
		var array = data.split(" ")
		var relevant = false;
		if(array[0] == "1"){
			floodMap.set(location, url)
			
			relevant = true;
			return "flood"
		}
		if(array[1] == "1"){
			fireMap.set(location, url)
			
			relevant = true;
			return "fire"
		}
		if(array[2] == "1"){
			earthQuakeMap.set(location, url);
			
			relevant = true;
			return "earthquake"
		}
		if(relevant == false){
			irrelevantMap.set(location, url)
			return "none"
		}
		
	});

	pyspawn.stderr.on("data", (data) => {
		console.log(`stderr: ${data}`);
		// res.send(data);
	});
}

var listener = app.listen(app.get("port"), function() {
	console.log("server running");
	console.log("Express server started on port: " + listener.address().port);
});

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

/*var tweetListener = app.post("/update", function(req, res) {


	if(req == "flood"){
		res.send(JSON.stringify(floodMap));
	}
	else if(req == "fire"){
		res.send(JSON.stringify(fireMap));
	}
	else if(req == "earthquake"){
		res.send(JSON.stringify(earthQuakeMap));
	}
	else{

	}
	//getTags(url);
	

	//res.send("maybe success");
});*/
