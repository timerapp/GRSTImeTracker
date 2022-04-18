import express from 'express';
const router = express.Router();
import timecard from '../../controller/timecardController.js'


//Get
router.get('/', timecard.Get)

router.put('/', timecard.Update)

export default router;