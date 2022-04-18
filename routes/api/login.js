import express from 'express';
const router = express.Router();
import login from '../../controller/loginController.js'
//Get
router.get('/', login.Get)

// Post
router.post('/', login.Create)



export default router;