import express from 'express';
const router = express.Router();
import snaps from '../../controller/snapsController.js'

//Get
router.get('/', snaps.Get)

router.post('/', snaps.Create)

export default router;