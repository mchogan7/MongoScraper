var express = require('express');
var router = express.Router();
var path = require('path');
var app = express();
var PORT = process.env.PORT || 4567;
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
mongoose.Promise = Promise;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));

var Comment = require("../models/Comment.js");
var Post = require("../models/Post.js");

mongoose.connect("mongodb://localhost/darrellist");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

router.get("/", function(req, res) {
    Post.find({}).populate('comment').exec( function(error, doc) {

        if (error) {
            console.log(error);
        } else {
            var dataObject = {}
            dataObject = {
                allPosts: doc
            };
            res.render("home", dataObject);
        }
    });
});

// app.get("/articles/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   Article.findOne({ "_id": req.params.id })
//   // ..and populate all of the notes associated with it
//   .populate("note")
//   // now, execute our query
//   .exec(function(error, doc) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the doc to the browser as a json object
//     else {
//       res.json(doc);
//     }
//   });
// });

router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("https://austin.craigslist.org/search/sss?query=darrell+%7C+darrel+%7C+Daryll+%7C+Darylin+%7C+Darel+%7C+Derrill&sort=rel&bundleDuplicates=1&searchNearby=2&nearbyArea=326&nearbyArea=327&nearbyArea=53&nearbyArea=449&nearbyArea=564&nearbyArea=270", function(error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".result-row").each(function(i, element) {

            // Save an empty result object
            var result = {};
            result.desc = $(this).find('a.hdrlnk').text();
            result.clID = $(this).attr('data-pid')
            result.url = $(this).find('a.hdrlnk').attr('href')
            result.price = $(this).find('a').children('.result-price').text();

            var getImage = $(this).children().first('a.result-image').attr('data-ids')

            if (getImage) {
                var imgID = getImage.split(',')[0].slice(2, 19)
                result.img = 'https://images.craigslist.org/' + imgID + '_600x450.jpg'
            } else {
                result.img = './images/default.jpg'
            }


            var entry = new Post(result);

            entry.save(function(err, doc) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log(doc);
                }
            });
        });

    });
    // Tell the browser that we finished scraping the text
    res.send("Scrape Complete");
});

router.post("/newComment", function(req, res) {

    var dataObject = {
        comment: req.body.text
    }
    var newComment = new Comment(dataObject);

    newComment.save(function(error, doc) {
        if (error) {
            console.log(error);
        } else {

            // {$push: {"messages": {title: title, msg: msg}}},
            // Use the article id to find and update it's note
            Post.findOneAndUpdate({ "_id": req.body.id }, { $push: { "comment": doc._id } })
                // Execute the above query
                .exec(function(err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    } else {
                    	var updatedObject = {}
                        updatedObject.id = doc.comment[0]
                        updatedObject.text = req.body.text
                        res.send(updatedObject);
                    }
                });
        }
    });
});
router.post("/deleteComment", function(req, res) {
    Comment.remove({ _id: req.body.id }, function(err) {
        if (err) {
        	console.log(err)
        } else {
        	res.json('removed');
        }
    });
        
});









//Keep this at the end of the router section.
//If nothing is found this is sent.
router.get('*', function(req, res) {
    res.status(404).send('404 Page Goes Here');
});

// Export routes for server.js to use.
module.exports = router;
