const express = require('express');
const path = require('path');
const app = express();
const pretty = require('./str_utils.js').prettyPrintObj;
const DistanceCalculator = require('./maps.js')
require('dotenv').config();

const dc = new DistanceCalculator(process.env.API_KEY);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * This endpoint consumes a pipe delimited origins string
 * and a destination string. These inputs are used to query
 * the Google Distance Matrix API. That JSON response is sent
 * back to the client.
 * 
 * Example origin string: "California|New York|North Carolina"
 * Example destination string: "Toronto"
 */
app.get('/compute-distance', function(req, res){
  console.log(`Running query: ${pretty(req.query)}`);
  if (!req.query.origins || !req.query.destination){
    res.json({error: "Get request is missing a parameter"}) 
    return;
  }
  dc.calculate(req.query.origins, req.query.destination)
    .then(apiResponse => {
      console.log(`Response: ${pretty(apiResponse)}`);
      if(apiResponse.status !== 'OK')
        return Promise.reject('API response status is not OK...')
      const responseJSON = {error: null, result: []};
      apiResponse.rows.forEach(row => responseJSON.result.push(row.elements[0]))
      console.log(`Sending ${pretty(responseJSON)} now`)
      res.json(responseJSON);
      console.log('Sent')
    })
    .catch(err => {
      console.log(`Error: ${err}`);
      res.json({error: "Something went wrong...try again later"});
    });
});

app.listen(3000, function(){
  console.log('App is listening on port 3000');
});
