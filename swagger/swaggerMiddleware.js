'use strict'

const initializeSwagger = require('swagger-tools').initializeMiddleware

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

      if (extraMiddlewares.length) {
        middlewareList.push(...extraMiddlewares)
      }

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
