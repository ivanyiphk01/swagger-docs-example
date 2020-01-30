'use strict'

const initializeSwagger = require('swagger-tools').initializeMiddleware
const responseNormalizer = require('./middlewares/responseNormalizer')
const parseQuery = require('./middlewares/parseQuery')

/**
 * @see https://github.com/apigee-127/swagger-tools/blob/master/docs/Middleware.md
 */
module.exports = ({
  definition = {},
  extraMiddlewares = [],
  controllers = ''
} = {}) =>
  new Promise(resolve => {
    initializeSwagger(definition, middleware => {
      const middlewareList = []
      middlewareList.push(middleware.swaggerMetadata())

      middlewareList.push(parseQuery)

      if (extraMiddlewares.length) {
        middlewareList.push(...extraMiddlewares)
      }

      middlewareList.push(responseNormalizer)

      middlewareList.push(
        middleware.swaggerValidator({
          validateResponse: true
        })
      )

      middlewareList.push(
        middleware.swaggerRouter({ controllers })
      )

      if (process.env.NODE_ENV !== 'production') {
        middlewareList.push(middleware.swaggerUi())
      }

      resolve(middlewareList)
    })
  })
