'use strict'

const path = require('path')
const definition = require('./swagger')

module.exports = async (extraMiddlewares = []) => {
  return {
    definition: definition,
    extraMiddlewares,
    controllers: path.join(__dirname, '..', 'controllers')
  }
}
