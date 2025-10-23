import type {Application, Request, Response} from "express";

const express = require('express')

const app:Application = express()
const port = 3000


app.get('/',( req: Request, res: Response  )=>{
    res.send("hi")
})



app.listen(3000,()=>{
    console.log("Listening port is 3000")
})
