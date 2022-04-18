import express from 'express';
const router = express.Router();
import moment from 'moment';

import User from '../../model/user.js'

//Put
router.put('/', (req,res)=>{
    let p = req.body;
    const updateUser = {
        'status': p.status,
        'last_session' : p.last_session,
        'last_recorded_time' : p.last_recorded_time
    };

    User.findOneAndUpdate(
        { "user_id" : p.user_id },
        { $set: updateUser },
        { returnNewDocument : true }
     )
    .sort({date:-1})
    .then(items=>{
        res.json(items)
    })

    
})

export default router;