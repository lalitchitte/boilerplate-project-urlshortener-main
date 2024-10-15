require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");
const urlParser = require("url");

const shortUrlMap = {};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

let urlDatabase = {}; // In-memory storage for URLs
let urlId = 1;

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const isValidUrl = (url) => {
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
};

// POST endpoint to shorten URL
app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;

  // Validate the URL
  if (!isValidUrl(originalUrl)) {
    return res.json({ error: "invalid url" });
  }

  // Create a new shortened URL
  const shortUrl = urlId++;
  urlDatabase[shortUrl] = originalUrl; // Store the original URL with the short URL as the key

  // Respond with the original and shortened URL
  res.json({
    original_url: originalUrl,
    short_url: shortUrl,
  });
});

// Redirect to the original URL
app.get("/api/shorturl/:short_url", (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl); // Redirect to the original URL
  } else {
    res.json({ error: "No short URL found for the given input" });
  }
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
