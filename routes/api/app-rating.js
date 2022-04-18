import express from 'express';
const router = express.Router();
import ratings from '../../controller/ratingsController.js'


//Get
router.get('/', ratings.Get)


export default router;