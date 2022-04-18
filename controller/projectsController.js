import _auth from '../routes/_auth.js'
import Project from '../model/project.js'

const Get =(req,res)=>{
    let token = req.query.token;

    //_auth(token)
    //.then(par=>{

        //(par.status!==404)? 1: ''//res.json(par.message)
    
        if(false){
            Project.findOne({
                //_id: par._id
            })
            .sort({date:-1})
            .then(items=>{
                res.json(items)
            })
            .catch(re=>{
                //console.log(re);
            })
        }else{
            Project.find()
            .sort({date:-1})
            .then(items=>{
                res.json(items)
            })
            .catch(re=>{
                //console.log(re);
            })
        }
    
    //})
    //.catch(re=>{
        //console.log(re);
    //})
}

const Create =(req,res)=>{
    var bdy = req.body
    const newProfile = new Project({
        project: bdy.project,
        tasks: bdy.tasks,
        description: bdy.description,
        status: bdy.status,
        company: bdy.company,
        projectleader: bdy.projectLeader,
        weeklyduration: bdy.weeklyduration,
        hourlyrate: bdy.hourlyrate
    });
    newProfile.save().then(item => res.json(item));
}

const Update =(req,res)=>{
    let bdy = req.body;
    //console.log(par)
    const updateProfile = {
        "project": bdy.project,
        "tasks": bdy.tasks,
        "description": bdy.description,
        "status": bdy.status,
        "company": bdy.company,
        "projectleader": bdy.projectleader,
        "weeklyduration": bdy.weeklyduration,
        "hourlyrate": bdy.hourlyrate,
        "comments":bdy.comments
    };

    Project.findOneAndUpdate(
        { "_id" : bdy._id },
        { $set: updateProfile },
        { returnNewDocument : true }
     )
    .sort({date:-1})
    .then(items=>{
        res.json(items)
    })
    //newProfile.save().then(item => res.json(item));
}

const Delete =(req,res)=>{
    Project.deleteOne( { "_id": req.body._id } )
    .then(r => res.json(r))  
}

export default {Get,Create,Update,Delete}