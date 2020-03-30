const express = require('express');
const router = express.Router();

router.get('/',(req, res) => {
    res.json({
        message: '🔒🔏🔐🔓'   
    });
});

router.post('/signup', (req, res) => {
    res.json({
        message:'done',
    });
});

module.exports = router;