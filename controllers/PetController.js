const Pet = require('../data/Pet.json')
const R = require('ramda')

module.exports = {
  getPetById(req, res) {
    const pet = Pet.find(pet => pet.id === req.swagger.params.id.value)
    if (!pet) {
      res.status(404).json('Pet not found')
    }
    res.json(pet)
  },
  getAllPets(req, res) {
    const query = req.parsedQuery
    const { page, pageSize } = query
    const list = Pet.slice((page - 1) * pageSize, pageSize)
    res.json({ list, total: Pet.length, page, pageSize })
  },
  createPet(req, res) {
    const body = R.propOr({}, 'body', req)
    res.json(body)
  }
}