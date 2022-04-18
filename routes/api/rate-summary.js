import express from 'express';
const router = express.Router();
import summary from '../../controller/summaryController.js'


//Get
router.get('/', summary.Get)


export default router;