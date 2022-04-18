import Snap from '../model/snap.js'

const Get = (req,res)=>{
    Snap.find({},{_id:0})
    .sort({created_at:1})
    .then(items=>{
        res.json(items)
    })
    .catch(re=>{
        //console.log(re);
    })
}

const Create = (req,res)=>{
    const newSnap = new Snap({
        user_id: req.body.user_id,
        mouse: req.body.mouse,
        keyboard: req.body.keyboard
    });

    newSnap.save().then(data => res.json(data));
}

const Update = (req,res)=>{
    
}

const Delete = (req,res)=>{
    
}

export default {Get,Create,Update,Delete}