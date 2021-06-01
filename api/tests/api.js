const app = require('../app')

const supertest = require('supertest')
const api = supertest(app)

module.exports = api
