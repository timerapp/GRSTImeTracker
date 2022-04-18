import Project from '../model/project.js'


const Get = (req,res)=>{
    
    Project.find({},{_id:1,project:1,current_users:1})
    .sort({date:-1})
    .then(items=>{
        res.json(items)
    })
    .catch(re=>{
        //console.log(re);
    })
}

const Create = (req,res)=>{

}

const Update = (req,res)=>{
    let bdy = req.body;
    //console.log(par)
    const updateProject = {
        "current_users": 1,
    };

     Project.findOneAndUpdate(
        { "_id" : bdy._id },
        { $inc: { current_users: 1 } },
        { returnNewDocument : true },
     )
    .sort({date:-1})
    .then(items=>{
        res.json(items)
    })

/*     Project.updateOne(
        { _id: bdy._id },
        { $inc: { current_users: 1 } }
     ).save().then(item => res.json(item)); */
}

export default {Get,Create,Update}