import express from 'express';
const router = express.Router();
import activity from '../../controller/activityController.js'

//Get
router.get('/', activity.Get)
//Post
router.post('/', activity.Create)


export default router;