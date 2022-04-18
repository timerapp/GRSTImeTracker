import express from 'express';
const router = express.Router();
import projects  from '../../controller/projectsController.js'
//Get
router.get('/', projects.Get)
//Post
router.post('/', projects.Create)

//Put
router.put('/', projects.Update)

router.delete('/', projects.Delete);


export default router;