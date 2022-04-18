import express from 'express';
const router = express.Router();
import idletime from '../../controller/idletimeController.js'


//Get
router.get('/', idletime.Get)


export default router;