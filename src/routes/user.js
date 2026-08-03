const express = require('express');
const { ConnectionRequest } = require('../models/connectionRequest.js');
const { userAuth } = require('../middlewares/auth.js');

const router = express.Router();

router.use(userAuth);



module.exports = router;