import express from 'express';
const router = express.Router();
import timesheet from '../../controller/timesheetController.js'
//Get
router.get('/', timesheet.Get)
//Post
router.post('/', timesheet.Create)


export default router;