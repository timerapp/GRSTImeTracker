import express from 'express';
const router = express.Router();
import profile from '../../controller/profileController.js'
//Get
router.get('/', profile.Get)
//Post
router.post('/', profile.Create)

//Put
router.put('/', profile.Update)


export default router;