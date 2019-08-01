const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
//Our Scraping Tools
const axios = require("axios");
const cherrio = require("cheerio");

//Require all models from models directory
const db = require("./models");
const path = require("path");
const Article = require("./models/Article");
const Note = require("./models/Note");

const PORT = process.event.PORT || 3000;

//Initialize Express
const app = express();

//Configure Middleware
//Use Morgan for logging requests
app.use(logger("dev"));

//Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Make public a static folder
app.use(express.static("public"));

//If Deployed use Deployed DB. Otherwide use local Mongo DB
let MONGOD_URI = process.env.MONGOD_URI || "mongodb;//localhost:27017/"


