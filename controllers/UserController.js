const User = require('../data/User.json')

module.exports = {
  getById(req, res) {
    const user = User.find(user => user.id === req.swagger.params.id.value)
    if (!user) {
      res.status(404).json('User not found')
    }
    res.json(user)
  },
  getAll() {
    res.json({ list: user })
  }
}