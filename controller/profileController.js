import _auth from '../routes/_auth.js'
import Profile from '../model/user.js' // profile


const Get = (req,res)=>{
    _auth(req.query.token)
    .then(par=>{
        (par.status!==404)? 1: ''// res.json(par.message)

        Profile.findOne({
            user_id: par.userid
        },{
            name: 1,
            projects: 1,
            _id: 0
        })
        .then(data=>{
            res.json(data)
        })
        .catch(re=>{
            //console.log(re);
        })
        //res.json(re)
    })
    .catch(re=>{
        console.log(re);
    })
}

const Create = (req,res)=>{
    const newProfile = new Profile({
        name: req.body.name,
        role: req.body.role,
        status: req.body.status,
        project_id : req.body.projId,
        projects: req.body.projects, // json object
        //user_id: req.body.userId,
        start_date : req.body.s_d,
        end_date : req.body.e_d,
        ratings : req.body.ratings, // json object
        interval : req.body.interval,
        snaps: req.body.snaps
    });

    newProfile.save().then(item => res.json(item));
}

const Update = (req,res)=>{
    let par = req.body;
    //console.log(par)
    const updateProfile = {
        "status" : par.status,
        "role": par.role,
        "interval" : par.interval,
        "snaps" : par.snaps,
        "projects" : par.projects,
        "ratings" : par.ratings
    };

    Profile.findOneAndUpdate(
        { "name" : par.name },
        { $set: updateProfile },
        { returnNewDocument : true }
     )
    .sort({date:-1})
    .then(items=>{
        res.json(items)
    })
}

const Delete = (req,res)=>{

}

export default {Get,Create,Update,Delete};