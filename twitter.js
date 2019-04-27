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

	if (tweet.geo == null) {
	}
	var obj = {
		coordinates: tweet.geo,
		url: tweet.quoted_status_permalink.url,
		imageUrl: imgurl,
		text: tweet.text,
		user: tweet.user.screen_name
	};
	// console.log(tweet);
	sendTweet(obj);
});

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
