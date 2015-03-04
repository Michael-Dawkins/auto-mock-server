var tv4 = require('tv4');

module.exports = {
  checkJSONSchema: function(data, schema) {
  	var result = [];
  	result.valid = tv4.validate(data, JSON.parse(schema));
    result.errorLog = JSON.stringify(tv4.error, null, 4);
    return result;
  }
};