const rp = require('request-promise');

/**
 * Object used to make calls to the Google Distance Matrix API.
 */
class DistanceCalculator{

  /**
   * Constructs a new DistanceCalculator object given a 
   * Google API key for the Distance Matrix API.
   * @param {string} apiKey 
   */
  constructor(apiKey){
    this.apiKey = apiKey;
  }

  /**
   * Produces the base link for accessing the Distance Matrix API
   * with the specified output format.
   * @param {string} format 
   */
  getBaseApiLink(format='json'){
    return `https://maps.googleapis.com/maps/api/distancematrix/${format}`
  }

  /**
   * Given a pipe delimited string with origin locations and a destination
   * location this method will compute the query string for the api link.
   * @param {string} origins 
   * @param {string} destination 
   */
  computeQueryString(origins, destination){
    return `units=imperial&origins=${origins}&destinations=${destination}&key=${this.apiKey}`
  }

  /**
   * Given a pipe delimited string with origin locations and a destination
   * location this method will make the actual call to the API and return a
   * promise that contains JSON response.
   * @param {string} origins 
   * @param {string} destination 
   */
  calculate(origins, destination){
    const requestLink = `${this.getBaseApiLink()}?${this.computeQueryString(origins, destination)}`
    console.log(requestLink);

    const options = {
      uri: requestLink,
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    }
    return rp(options)
  }
}

module.exports = DistanceCalculator;
