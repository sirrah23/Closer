const express = require('express');
const path = require('path');
const app = express();
const request = require('request');
require('dotenv').config();

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/compute-distance', function(req, res){
  console.log(req.query);
  let respJSON = {error: "Something went wrong, try again later"};
  if (!req.query.origins || !req.query.destination){
    res.json({error: "Get request is missing a parameter"}) 
  }
  const mapsAPIRequestLink = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${req.query.origins}&destinations=${req.query.destination}&key=${process.env.API_KEY}`
  request(mapsAPIRequestLink, function (error, response, body) {
    console.log(body);
    if(error !== null){
      console.log(`Http Request Error: ${error}}`)
      res.json(respJSON);
      return;
    }
    const bodyJSON = JSON.parse(body);
    if(bodyJSON.status !== "OK"){
      console.log(`Google API returned an error: ${bodyJSON.status}`)
      res.json(respJSON);
      return
    }
    respJSON = {error: null, result: []};
    bodyJSON.rows.forEach(function(row){
      respJSON.result.push(row.elements[0]);
    })
    res.json(respJSON);
  });
});

app.listen(3000, function(){
  console.log('App is listening on port 3000');
});
