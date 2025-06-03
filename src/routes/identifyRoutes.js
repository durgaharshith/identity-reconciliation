//identifyRoutes.js
const express = require('express');
const router = express.Router();
const {identifyContact, deleteContact} = require('../controllers/identifyController');



router.post('/identify', identifyContact);
router.delete('/contacts/:id', deleteContact);


module.exports = router;