const express = require('express');

const router = express.Router();
const controller = require('../controllers/users.controller');


router.get('/', controller.list);

router.patch('/:id', controller.updateOne);

module.exports = router;
