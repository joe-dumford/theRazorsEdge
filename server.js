const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
//Our Scraping Tools
const axios = require("axios");
const cheerio = require("cheerio");

//Require all models from models directory
const db = require("./models");
const path = require("path");
const Article = require("./models/Article");
const Note = require("./models/Note");

const PORT = process.env.PORT || 3000;

//Initialize Express
const app = express();

//Configure Middleware
//Use Morgan for logging requests
app.use(logger("dev"));

//Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//Make public a static folder
app.use(express.static("public"));

//If Deployed use Deployed DB. Otherwide use local Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/razorsHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParse: true });

//=================================ROUTES===========================================
const assetsPath = path.join(__dirname, '../public');
app.use(express.static('assetsPath'));

//A GET route for scraping the GuitarWorld Website
app.get("/", function (req, res) {

    axios.get("https://www.guitarworld.com/artists/interviews").then(function (response) {
        //Loading response into Cheerio & save it to a var to make a "shorthand selector"
        var $ = cheerio.load(response.data);
        //Grabbing Articles by listingResult class tag
        $(".listingResult").each(function (i, element) {
            //Add text & href of every link. Save them as properties
            //Then create a new Article from result object
            let newArticle = new Article({
                title: $(this).children("a").text(),
                link: $(this).children("a").attr("href"),
            });
            newArticle.save();
        });
        //Send Message to Client
        res.send("Scrape Complete");
    });
});

//Route for getting all Articles from the DB
app.get("/articles", (req, res) => {
    //Grab every document in the Articles collection
    db.Article.find({})
        .then((dbArticle) => {
            res.send(dbArticle); //If success, send Articles back to client
            console.log(res);
        })
        .catch((err) => {
            res.json(err);
        });
});

// Route for grabbing a specific Article by id from DB
app.get("/articles/:id", (req, res) => {
    //Using id passed in to prepare a query that finds the matching one in DB
    db.Article.findOne({
            _id: req.params.id
        })
        .populate("note") //populate the notes associated with it
        .then((dbArticle) => {
            res.json(dbArticle) //If successful send Article w/ that id back to client
        })
        .catch((err) => {
            res.json(err);
        });
});

//Route for saving & updating an Article's associated Note
app.post("/articles/:id", (req, res) => {
    //Creating a new note 
    db.Note.create(req.body)
        .then((dbNote) => {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then((dbArticle) => {
            res.json(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
});

//Start Server
app.listen(PORT, () => {
    console.log("I'm listening on port " + PORT);
});