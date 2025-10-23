import type { Application, Request, Response, Express } from 'express'

const express = require('express')
const usersRouter = require('./routes/users')

const app: Application = express()
const port = 3000

app.use(usersRouter)

app.listen(port, () => {
    console.log('Listening port is 3000')
})
