import type { Router } from 'express'

const express = require('express')
const router: Router = express.Router()

router.get('/', (req, res) => {
    res.json([{ id: 1 }])
})

module.exports = router
