/**
 * Returns a pretty-string version of the input object
 * with the specified level of indentation.
 * @param {object} obj 
 * @param {integer} indentation 
 */
module.exports.prettyPrintObj = function(obj, indentation=2){
  return JSON.stringify(obj, null, indentation)
}
