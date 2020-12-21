const express = require('express')
const Response = require('./dao/Response')
const router = require('./router/index')
const bodyParser = require('body-parser')

const server = express()
const PORT = 3000

const { crossOrigin } = require('./utils/utils')

server.use('/', crossOrigin)
server.use(bodyParser.json())
server.use('/', router)

server.listen(PORT, () => {
  console.clear()
  console.log(`the port is listening http://localhost:${PORT}`)
})
