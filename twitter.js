var Twit = require("twit");
var config = require("./config");
var T = new Twit(config);

var params = {
	q: "flood",
	count: 10
};

var sanFrancisco = ["-122.75", "36.8", "-121.75", "37.8"];
//30.351449, -97.852871
//30.216850, -97.640237
var austin = ["-97.852871", "30.216850", "-97.640237", "30.351449"];

var stream = T.stream("statuses/filter", {locations: austin});

stream.on("tweet", function(tweet) {
	// console.log(tweet);
	var imgurl;
	if (tweet.entities.media && tweet.entities.media.type == "photo") {
		imgurl = tweet.entities.media.media_url;
	}

	var point = [];
	if (tweet.geo) {
		point = tweet.geo.coordinates;
		console.log("using geo: " + point);
		// return;
	} else if (tweet.place) {
		//try place
		var cords = tweet.place.bounding_box.coordinates[0];
		// console.log(cords);
		var area =
			Math.abs(cords[2][0] - cords[0][0]) *
			Math.abs(cords[2][1] - cords[0][1]);
		if (area > 0.2) {
			console.log("too big buddy: " + cords);
			// return;
			point[1] = -97.741845 + Math.random() * 0.07;
			point[0] = 30.270299 + Math.random() * 0.07;
		}
		point[1] = 0.5 * (cords[2][0] + cords[0][0]);
		point[0] = 0.5 * (cords[2][1] + cords[0][1]);
		console.log("using place: " + point);
	}

	var tweeturl =
		"https://twitter.com/" +
		tweet.user.screen_name +
		"/status/" +
		tweet.id_str;

	var obj = {
		coordinates: point,
		url: tweeturl,
		imageUrl: imgurl,
		text: tweet.text,
		user: tweet.user.screen_name
	};
	// console.log(tweet);
	sendTweet(obj);
	console.log("success");
	console.log(obj);
});

function sendTweet(obj) {}
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
app.use(bodyParser.urlencoded({extended: false}));

// -------------- express initialization -------------- //

// Here, we set the port (these settings are specific to our site)
app.set("port", process.env.PORT || 8080);
app.use(fileUpload());

function getTags(url) {
	const spawn = require("child_process").spawn;
	const pyFile = "c.py";
	const args = [url];
	args.unshift(pyFile);

	const pyspawn = spawn("python2", args);
	pyspawn.stdout.on("data", (data) => {
		console.log(`stdout: ${data}`);
		// res.send(data);
		return data;
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

var tweetListener = app.post("/getTags", function(req, res) {
	url = req.body.url;

	// construct complete file path

	getTags(url);
	/*fs.writeFile(image_file_path, vessel, function (err) {
          if (err){
              res.send("couldnt save file")
          }
          console.log('Saved!' + beforeName.toString());
          
        });*/
	//justSendSomething(res)

	//res.send("maybe success");
});
