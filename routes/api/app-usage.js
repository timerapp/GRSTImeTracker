import express from 'express';
const router = express.Router();
import usage from '../../controller/usageController.js'

//Get
router.get('/', usage.Get)
//Post
router.post('/', usage.Create)


export default router;