import express from 'express';
const router = express.Router();
import moment from 'moment';

import User from '../../model/user.js'

//Get
router.get('/', (req,res)=>{
    var pr = req.query
    
    if(pr.userid){
        User.findOne({
            user_id: pr.userid
        })
        .sort({date:-1})
        .then(items=>{
            res.json(items)
        })
        .catch(re=>{
            //console.log(re);
        })
    }else{
        User.find({},{_id:0,name:1,user_id:1,status:1,skills:1,client_company:1})
        .sort({date:-1})
        .then(items=>{
            res.json(items)
        })
        .catch(re=>{
            //console.log(re);
        })
    }
})



export default router;