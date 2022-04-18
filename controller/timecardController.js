import mm from 'moment-timezone';
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
    
    let token = req.query.token;

    _auth(token)
    .then(par=>{

        if(par.status!==404){
            let f = mm.tz(req.query.from,"Asia/Manila").toISOString(true)
            let t = mm.tz(req.query.to,"Asia/Manila").toISOString(true)
            //console.log(f,new Date(f).toISOString())
    
            var pipeline = [
                {$unwind:"$apps"},
                { $project: {
                    apps: {
                        total: {$sum:"$apps.total"}, 
                        rating: "$apps.rating",
                        name: "$apps.name",
                        date:{
                            $dateToString: {
                                date: "$_id",
                                format: "%Y-%m-%d",
                            }
                        },
                    },
                    _id: "$created_at"
                }},
                {$group: {
                    _id: "$apps.name",
                    apps: {$sum:"$apps.total"},
                    date: {$push:"$apps.date"}
                }}
            ]
            var pipeline1 = [
                {$match: {
                        user_id: req.query.userid,
                        date: {$gte: f, $lt: t}
                        // date: { $dateToString: {
                        //     date: "$created_at", // created_at
                        //     format: "%Y-%m-%d"
                        // }}, 
                        //$date: {$gte: req.query.from, $lt: req.query.to}
                            
                        
                        //created_at:, // created_at
                    }
                },
                {$unwind:"$apps"},
                {$group : {
                    _id: {$dateToString: {
                        date: "$created_at", // created_at
                        format: "%Y-%m-%d",
                    }},
                    total: {$sum:"$apps.total"},
                    start: {$min:"$created_at"},
                    end: {$max:"$created_at"}
                }
    
                },
                {$sort:{_id:-1}}
            ]
            var pipeline2 = [
                {
                    $project : {
                        _id: "$created_at",
                        apps: "$apps"
                    }
                },
                {$unwind: "$apps"},
                {
                    $group : {
                        _id: "$_id",
                        apps: {
                            $sum: "$apps.total"
                        }
                    }
                }
            ]
            const data = []
            Activities.aggregate(pipeline1)
            .then((r)=>{
                let tt = 0
                const dt = r.map(({_id,total,start,end})=>{
    
                    tt+=total
                    return {
                        "date": mm.tz(_id,"Asia/Manila").format("MMM Do YY"),
                        "total": ToHms(total),
                        "ins":mm.tz(start,"Asia/Manila").format('LT'),
                        "out":mm.tz(end,"Asia/Manila").format('LT'),
                        //"apps": apps,
                    }
                })
                let ds = dt.map( ({ date,total,ins,out })=>{
                    return {
                        "date":date,
                        "total":total,
                        "in":ins,
                        "out":out
                    }
                } )
                data.push({
                    "totalTime":ToHms(tt),
                    "range": ds
                })
    
                res.json(data);
            })
            .catch(re=>{
                //console.log(re);
            })
        }else{
            res.json(par);
        }
        
        res.json(par);
    })
}

const Create = (req,res)=>{

}

const Update = (req,res)=>{
    let p = req.query;
    let f = mm.tz(p.from,"Asia/Manila").toISOString(true)
    let t = mm.tz(p.to,"Asia/Manila").toISOString(true)
    Activity.updateMany(

        { 
            user_id : p.userid, // Query
            date : {$gte: f,$lt: t}
        }, 
        { $inc :{ partialTime: Number(p.value) } }, // Update 
        //{ $inc: { "apps.$[elem].total" : Number(p.value) } },
        //{ arrayFilters: [ { "elem.total": { $exists: true, $not: {$size: 0} } } ] },
        function (err, docs) { // Callback
            if (err){
                console.log(err)
            }
            else{
                res.json(docs);
            }
        }
    )
}

export default {Get, Create, Update}