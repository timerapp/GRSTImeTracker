import express from 'express';
const router = express.Router();
import edits from '../../controller/editsController.js'

// Get Request
router.get('/', edits.Get)

router.put('/', edits.Update)

export default router