const Pet = require('../data/Pet.json')

module.exports = {
  getById(req, res) {
    const pet = Pet.find(pet => pet.id === req.swagger.params.id.value)
    if (!pet) {
      res.status(404).json('Pet not found')
    }
    res.json(pet)
  },
  getAll() {
    res.json({ list: Pet })
  }
}