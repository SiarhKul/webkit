import express from 'express'
import usersRouter from './routes/users.js'
const app = express()
const port = 3001
app.use(usersRouter)
app.listen(port, () => {
    console.log(`Listening port is ${port}`)
})
//# sourceMappingURL=main.js.map
