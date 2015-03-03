var tv4 = require('tv4');

module.exports = {
  checkJSONSchema: function(data, schema) {
    return tv4.validate(JSON.parse(data), JSON.parse(schema));
  }
};