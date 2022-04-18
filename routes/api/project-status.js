import express from 'express';
const router = express.Router();
import project from '../../controller/projectController.js'

//Get
router.get('/', project.Get)

//Put
router.put('/', project.Update)

export default router;