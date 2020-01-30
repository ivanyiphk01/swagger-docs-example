const JsonNodeNormalizer = require("json-node-normalizer");
const R = require("ramda");
const mung = require("express-mung");

module.exports = mung.jsonAsync(async (body, req, res) => {
  const operation = req.swagger.operation;
  const schema = R.path(['responses', '200', 'schema'], operation)
  const httpStatus = res.statusCode;

  if (httpStatus === 200 && !R.isEmpty(schema) && !R.isNil(schema) && typeof body === 'object') {
    const normalizedJson = await JsonNodeNormalizer.normalize(body, schema);
    const definedProperties = Object.keys(schema.properties)
    const responseJson = trimExcess(normalizedJson, definedProperties)
    return responseJson;
  } else {
    return body;
  }
});

function trimExcess(body, properties) {
  /* TODO: support nested object and arrays */
  if (!R.isEmpty(properties)) {
    const bodyFields = Object.keys(body);
    const excessFields = R.difference(bodyFields, properties);
    excessFields.forEach(fieldName => {
      delete body[fieldName];
    });
  }
  return body;
}
