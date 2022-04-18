import express from 'express';
const router = express.Router();
import ts from '../../controller/tsController.js'


//Get
router.get('/', ts.Get)
//Post
router.post('/', ts.Create)


module.exports = router;