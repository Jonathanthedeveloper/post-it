const express = require('express');
const router = express.Router();

const { getHealth } = require('../controllers/healthController');


router.all('/', getHealth)

module.exports = router;