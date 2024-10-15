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

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(url)) {
    return res.json({ error: 'invalid url' });
  }
  const shortUrl = Math.floor(Math.random() * 10000);
  shortUrlMap[shortUrl] = url;
  res.json({ original_url: url, short_url });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;
  const originalUrl = shortUrlMap[shortUrl];
  if (!originalUrl) {
    return res.status(404).json({ error: 'short url not found' });
  }
  res.redirect(originalUrl);
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
