import express from 'express';
const router = express.Router();
import topusers from '../../controller/topusersController.js'


//Get
router.get('/', topusers.Get)
//Post
router.post('/', topusers.Create)


export default router;