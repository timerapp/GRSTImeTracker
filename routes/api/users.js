//const { json } = require('body-parser');
import express from 'express';
const router = express.Router();
import users from '../../controller/usersController.js'

//Get
router.get('/', users.Get)
//Post
router.post('/', users.Create)

//Put
router.put('/', users.Update)

router.delete('/', users.Delete);

export default router;