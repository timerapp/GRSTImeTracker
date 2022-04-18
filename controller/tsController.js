import mm from 'moment-timezone';
import _auth from '../routes/_auth.js'
import Activity from '../model/activity.js'
import _m from 'moment';

function ToHms(d) {
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
    let token = req.query.token;

    _auth(token)
    .then(par=>{

        (par.status!==404)? 1: ''// res.json(par.message)
    
        let f = mm.tz(req.query.from,"Asia/Manila").toISOString(true)
        let t = mm.tz(req.query.to,"Asia/Manila").toISOString(true)
        
        let pipeline = [
            {
                $match : {
                    user_id : par.userid,
                    date : {$gte: f,$lt: t}
                }
            },
            {$unwind:"$apps"},
            {
                $group: {
                    _id: {
                        $dateToString: {
                        date: "$created_at",
                        format: "%Y-%m-%d",
                        },
                    },
                    apps : {
                        $push: "$apps"
                    },
                    created_at: {$push: "$created_at"}
                },
            },
            {$unwind:"$apps"},
            {
                $group : {
                    _id : {name: '$apps.name', date: "$_id", rating : "$apps.rating", url : "$apps.url"},
                    total: {$sum: "$apps.total" }
                }
            },
            {
                $group: {
                    _id:{date: "$_id.date", name: '$_id.name', rating: "$_id.rating", url: "$_id.url", total: "$total"},
                    
                }
            },
            {$unwind:"$_id"},
            { "$replaceRoot": {
                "newRoot": {
                "$mergeObjects": ["$$ROOT", "$_id"]
                }
            }},
            {
                $group: {
                    _id:"$_id.date",
                    apps: {$push: {name: "$name", rating: "$rating", url: "$url", total: {$sum: "$total" } } },
                    total: {$sum: "$total" } 
                }
            },
            {$sort: {_id: -1}}
        ]

        let pipeline1 = [
            {
                $match : {
                    name : par.user,
                    created_at : {$gte: new Date(f),$lt: new Date(t)}
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            date: "$created_at",
                            format: "%Y-%m-%d",
                        }
                    },
                    apps: {
                        $push: "$apps"
                    }
                }
            },
            {
                $unwind: "$apps"
            },
            {
                $group : {
                    _id : { name: "$apps.name", date: "$_id", apps: "$apps" }
                }
            },
            {$unwind:"$_id"},
            {
                $group : {
                    _id: {
                            date: "$_id.date",
                            rating: "$_id.apps.rating"
                    }
                }
            },
            { 
                "$replaceRoot": {
                    "newRoot": {
                        "$mergeObjects": ["$$ROOT", "$_id"]
                    }
                }
            },
            {
                $group: {
                        _id:"$date",
                        apps: {
                            $push: "$rating" 
                        //total: {$sum: "$partial_total" 
                        } 
                }
            },
            {
                $sort: {_id:-1}
            }
        ]


        const data = []
        Activity.aggregate(pipeline)

        .limit(30)
        .then((items)=>{
            const dt = items.map(({_id,date,apps,total,ins,out})=>{


                return {
                    "date": _id,
                    "total": ToHms(total),
                    //"in":_m.tz(ins,"Asia/Manila").format('lll'),
                    //"out":_m.tz(out,"Asia/Manila").format('lll'),
                    "apps": apps,
                }
            })
            data.push(dt)

            res.json(dt);
        })
        .catch(re=>{
            //console.log(re);
        })

    })
}

const Create = (req,res)=>{
    
    const newActivity = new Activity({
        name: req.body.name,
        activity_id: req.body.act_id,
        project_id : req.body.projId,
        project:req.body.project,
        task:req.body.task,
        user_id: req.body.userId,
        start_date : req.body.s_d,
        end_date : req.body.e_d,
        breaks: req.body.usebreaks,
        meeting: req.body.meeting,
        partial_total : req.body.partial_total,
        total: req.body.total,
        keyboard : req.body.k_b,
        mouse : req.body.mouse,
        apps : req.body.apps
    });

    newActivity.save().then(act => res.json(act));
}

const Update = (req,res)=>{
    
}

const Delete = (req,res)=>{
    
}

export default {Get,Create,Update,Delete}