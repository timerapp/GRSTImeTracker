import express from 'express';
const router = express.Router();
import topapps from '../../controller/topappsController.js'


//Get
router.get('/', topapps.Get)


export default router;