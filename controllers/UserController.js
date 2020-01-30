const User = require('../data/User.json')

module.exports = {
  getUserById(req, res) {
    const user = User.find(user => user.id === req.swagger.params.id.value)
    if (!user) {
      res.status(404).json('User not found')
    }
    res.json(user)
  },
  getAllUsers(req, res) {
    const query = req.parsedQuery
    const { page, pageSize } = query
    const list = Pet.slice((page - 1) * pageSize, pageSize)
    res.json({ list, total: User.length, page, pageSize })
  }
}