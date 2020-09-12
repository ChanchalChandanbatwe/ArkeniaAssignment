const express = require("express");
const app = express();
const body_parser = require("body-parser");
const mongoose = require('mongoose');


let uri = 'mongodb://127.0.0.1:27017/sampleApplication';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connection Success');
  }).catch((error) => {
    console.log('Connection failed' + error);
  });

app.use(body_parser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});


var recipes = require('./router/recipes.routing');
app.use('/api/recipes', recipes);
module.exports = app;
