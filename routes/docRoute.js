const express = require('express');
const router = express.Router();

const { renderBaseUrl, renderDocumentation } = require('../controllers/documentationController')


router.get('/', renderBaseUrl);
router.get('/docs', renderDocumentation);

module.exports = router;