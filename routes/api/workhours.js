import express from 'express';
const router = express.Router();
import workhours from '../../controller/workhoursController.js'


//Get
router.get('/', workhours.Get)


export default router;