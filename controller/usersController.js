import User from '../model/user.js'


const Get = (req,res)=>{
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
        User.find({},{_id:0})
        .sort({date:-1})
        .then(items=>{
            res.json(items)
        })
        .catch(re=>{
            //console.log(re);
        })
    }
}

const Create = (req,res)=>{

    const p = req.body
    //console.log(p);
    const newUser = new User({
        name: p.name,
        company: p.company,
        company_id : p.company_id,
        projects: p.projects, // Object
        client_company: p.client_company,
        global_manager: p.global_manager,
        role : p.type,
        access_level: p.access_level,
        rate_per_hour: p.rate_per_hour,
        hours_per_week: p.hours_per_week,
        tasks: p.tasks, // Object
        start_date : p.start_date,
        end_date : p.end_date,
        ratings : p.ratings, // Object
        status : p.status,
        skills: p.skills,
        email: p.email,
        contact_number: p.contact_number,
        interval : p.interval,
        snaps : p.snaps,
        timeout: p.timeout
    });

    newUser.save().then(newuser => res.json(newuser));
}

const Update = (req,res)=>{
    let p = req.body;
    const updateUser = {
        'name': p.name,
        'company': p.company,
        'company_id' : p.company_id,
        'projects': p.projects, // Object
        'client_company': p.client_company,
        'global_manager': p.global_manager,
        'role' : p.type,
        'access_level': p.access_level,
        'rate_per_hour': p.rate_per_hour,
        'hours_per_week': p.hours_per_week,
        'tasks': p.tasks, // Object
        'start_date' : p.start_date,
        'end_date' : p.end_date,
        'ratings' : p.ratings, // Object
        'status' : p.status,
        'skills': p.skills,
        'email': p.email,
        'contact_number': p.contact_number,
        'interval' : p.interval,
        'snaps' : p.snaps,
        'timeout' : p.timeout,
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
}

const Delete = (req,res)=>{
    User.deleteOne( { "user_id": req.body.userid } )
    .then(r => res.json(r))  
}

export default {Get,Create,Update,Delete}