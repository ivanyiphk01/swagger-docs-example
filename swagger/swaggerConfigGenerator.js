'use strict'

const path = require('path')
const definition = require('.')

module.exports = async (extraMiddlewares = []) => {
  return {
    definition: definition,
    extraMiddlewares,
    controllers: path.join(__dirname, '..', 'controllers')
  }
}
