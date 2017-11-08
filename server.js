const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, function(){
  console.log('App is listening on port 3000');
});
