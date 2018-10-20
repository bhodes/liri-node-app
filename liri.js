require("dotenv").config();
var request = require("request")
var fs = require("fs");

var action = process.argv[2];
var param = process.argv[3];

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

//if action=concert-this, spotify-this-song, movie-this, do-what-it-says then function
if (action === "movie-this") {
    movieThis(param);
}
else if (action === "spotify-this") {
    spotifyThisSong(param);
}
else if (action === "concert-this") {
    bandsInTown(param)
}
else if (action === "do-what-it-says") {
    doWhatItSays(param)
}

//functions
//spotify
function spotifyThisSong(songName) {
    var songName = process.argv[3];
    if (!songName) {
        songName = "The Sign";
    }
    param = songName;
    spotify.search({ type: "track", query: param }, function (err, data) {
        if (!err) {
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                        "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                        "Song: " + songInfo[i].name + "\r\n" +
                        "Album: " + songInfo[i].album.name + "\r\n" +
                        "Preview Url: " + songInfo[i].preview_url + "\r\n" +
                        "------------------------------ " + i + " ------------------------------" + "\r\n";
                    console.log(spotifyResults);
                }
            }
        } else {
            console.log("Error :" + err);
            return;
        }
    });
};


//bands function
function bandsInTown(param) {

    if (action === 'concert-this') {
        var artist = "";
        for (var i = 3; i < process.argv.length; i++) {
            artist += process.argv[i];
        }
        console.log(artist);
    }
    else {
        artist = parameter;
    }



    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codecademy";


    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var info = JSON.parse(body);
            for (i = 0; i < info.length; i++) {
                var dTime = info[i].datetime;
                var month = dTime.substring(5, 7);
                var year = dTime.substring(0, 4);
                var day = dTime.substring(8, 10);
                var dateForm = month + "/" + day + "/" + year

                console.log("Date: " + dateForm);
                console.log("Name: " + info[i].venue.name);
                console.log("City: " + info[i].venue.city);
                if (info[i].venue.region !== "") {
                    console.log("Country: " + info[i].venue.region);
                }
                console.log("Country: " + info[i].venue.country);

            }
        }
    });
}

//movie function
function movieThis(param) {
    var movieName = "";
    var nodeArgs = process.argv;
    if (param === undefined) {
        param = "Mr. Nobody";
    } else {
        param = param;
    };
    //attempt to allow multiple words in argument
    for (var i = 2; i < nodeArgs.length; i++) {

        if (i > 2 && i < nodeArgs.length) {

            movieName = movieName + "+" + nodeArgs[i];
        }
        else {
            movieName += nodeArgs[i];
        }
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + param + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (err, res, body) {
        var bodyOf = JSON.parse(body);
        if (!err && res.statusCode === 200) {
            console.log("Title: " + bodyOf.Title);
            console.log("Release Year: " + bodyOf.Year);
            console.log("IMDB Rating: " + bodyOf.imdbRating);
            console.log("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value);
            console.log("Country: " + bodyOf.Country);
            console.log("Language: " + bodyOf.Language);
            console.log("Plot: " + bodyOf.Plot);
            console.log("Actors: " + bodyOf.Actors);
        }
    });
};




// Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error) {
            doWhatItSaysResults = data.split(",");
            spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
        } else {
            console.log("Error:" + error);
        }
    });
};

