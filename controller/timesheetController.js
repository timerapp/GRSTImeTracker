import _auth from '../routes/_auth.js'
import Activities from '../model/activity.js'

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
    let {token,userid,f,t} = _q(req)

    _auth(token)
    .then(par=>{

        //let f = mm.tz(req.query.from,"Asia/Manila").toISOString(true)
        //let t = mm.tz(req.query.to,"Asia/Manila").toISOString(true)

        if(par.status!==404){
            Activities.aggregate(
                [
                    // Your basic query conditions
                    { $match: {
                            user_id: req.query.userid,
                            date : {$gte: f,$lt: t}
                    }},
    
                    { $unwind: "$apps"},
    
                    /* { $project: { 
                        _id: 0, 
                        name: 1,
                        'apps.name': 1,
                        'apps.total':1
                    }}, */
                    // List of all used apps with total number of 'used instances'
                    /* { $group : 
                        { _id : '$apps.name', total: {$sum:1} }
                    }, */
                    // Top 5 Apps (name, total)
                    /*{ $group : 
                        { _id : '$apps.name', apps: {$sum:'$apps.total'} }
                    },
                    {$sort: {apps:-1}},
                    {$limit : 5}  */
                    //{ $out : 'aggResults' }
                    //List of used apps with total in each used instances 
                    /* { $group : 
                        { _id : '$apps.name', apps: {$push:'$apps.total'} }
                    }, */
                    // List of Productivity Total (Prod,Unprod,Unrated)
                    { $group : 
                        { 
                            _id : { rating:'$apps.rating' },
                            apps : { $push:'$apps' }, //$sum:'$apps.total'
                            date: {$push:'$created_at'}
                        }
                    },
                    {$unwind:"$date"},
                    { "$replaceRoot": {
                        "newRoot": {
                        "$mergeObjects": ["$$ROOT", {_id: "$_id", apps:"$apps",date:"$date"}]
                        }
                    }},
                    //{$unwind:"$app"},
                    //{$unwind:"$_id"},
                    /*{ $group : 
                        { 
                            _id : { 
                                $dateToString: {
                                    date: "$date",
                                    format: "%Y-%m-%d",
                                }
                            },
                            apps: {$push:'$_id'}
                            
                        }
                    }  */
                    { $project: { 
                        _id: "$$ROOT"
                    }},
                    // Get the daily total
                    /* {$group: {
                        _id: {
                                date: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                                sender: '$name',
    
                        },
                        count: {$sum: '$partial_total'},
                        apps: {$push:'$apps'},
                        counts: {$sum:1}
                    }},
                    { $unwind: "$apps"},
                    {$group: {
                        _id: '$_id.sender',
                        days : {$push: {date: '$_id.date', count: '$count', apps : {name:'$apps.name'}}},
                        
                    }}, */
    
                ],
            ).then(r=>res.json(r))
            .catch(re=>{
                //console.log(re);
            })
        }else{
            res.json(par)
        }
    

    
    })
}

const Create = (req,res)=>{
    const newActivities = new Activities({
        name: req.body.name
    });

    newActivities.save().then(data => res.json(data));
}

const Update = (req,res)=>{
    
}

const Delete = (req,res)=>{
    
}

export default {Get,Create,Update,Delete}