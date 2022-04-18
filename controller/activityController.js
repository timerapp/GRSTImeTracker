import Activity from '../model/activity.js'
import _auth from '../routes/_auth.js'
import _q from '../routes/_query.js'

function _hms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
}

const Get = (req,res)=>{
    let {token,userid,f,t} = _q(req);

    //_auth(token)
    //.then(par=>{

        //(par.status!==404)? 1: '';
    
        //let from = mm.tz(f,"Asia/Manila").toISOString(true)
        //let to = mm.tz(t,"Asia/Manila").toISOString(true)
        
        const data = []
        Activity.aggregate([
            {$match: { 
                user_id: userid,
                date:{
                    $gte:f,
                    $lte:t
                } 
            }}, 
            {$unwind:'$apps'},
        ])
        .limit(20)
        .then((items)=>{
            const dt = items.map(({_id,date,name, partialTime, total,project,task ,status,breaks, meeting, apps,login, logout,created_at})=>{
                return {
                    "name":name,
                    "total":partialTime,
                    "date":date
                }
            })
            data.push(dt)

            res.json(data);
        })
        .catch(re=>{

        })

    //})
}

const Create = (req,res) =>{
    const newActivity = new Activity({
        name : req.body.name,
        date : req.body.date,
        status : req.body.status,

        user_id : req.body.user_id,
        project_id : req.body.project_id,
        task_id : req.body.task_id,

        project : req.body.project,
        task : req.body.task,

        breakSnap : req.body.breakSnap,
        meetingSnap : req.body.meetingSnap,

        partialTime : req.body.partialTime,
        totalTime : req.body.totalTime,
        idleTime: req.body.idleTime,
        keyboard : req.body.keyboard,
        mouse : req.body.mouse,

        apps : req.body.apps
    });

    newActivity.save().then(data => res.json(data));
}

export default {Get, Create};