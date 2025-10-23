import type { Router } from 'express'
const EmployController = require('../controllers/EmployController')

const express = require('express')
const router: Router = express.Router()

router.get('/', EmployController.getAllUsers)

module.exports = router
