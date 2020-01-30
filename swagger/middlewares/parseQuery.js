const R = require('ramda')

module.exports = function(req, res, next) {
  const params = R.pathOr({}, ['swagger', 'params'], req)
  const queryParams = R.filter(R.pathEq(['schema', 'in'], 'query') ,params)
  req.parsedQuery = R.mergeLeft(R.map(R.path(['value']), queryParams), req.query)
  next()
}