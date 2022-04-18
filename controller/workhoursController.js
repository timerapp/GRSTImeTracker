import _auth from '../routes/_auth.js'
import mm from 'moment-timezone';

import Activities from '../model/activity.js'
function ToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "." : ".") : "0.";
    var mDisplay = m > 0 ? m + (m == 1 ? "." : ".") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? "." : ".") : "";
    return parseFloat(hDisplay + mDisplay)// + sDisplay; 
}


const Get = (req,res)=>{
    
    let token = req.query.token;

    _auth(token)
    .then(par=>{

        if(par.status!==404){

            let f = mm.tz(req.query.from,"Asia/Manila").toISOString(true)
            let t = mm.tz(req.query.to,"Asia/Manila").toISOString(true)
    
            var pipeline1 = [
                {$match: {
                        user_id: req.query.userid,
                        date : {$gte: f,$lt: t}
                    }
                },
                {$unwind:"$apps"},
                {$group : {
                    _id: {$dateToString: {
                        date: "$created_at",
                        format: "%Y-%m-%d",
                    }},
                    total: {$sum:"$apps.total"},
                    start: {$min:"$created_at"},
                    end: {$max:"$created_at"}
                }
    
                },
                {$sort:{_id:-1}}
            ]
    
            const data = []
            Activities.aggregate(pipeline1)
            .then((r)=>{
                let tt = 0
                const dt = r.map(({_id,total,start,end})=>{
    
                    tt+=total
                    return {
                        "date": _id,
                        "total": total
                    }
                })
                let ds = dt.map( ({ date,total,ins,out })=>{
                    return {
                        "date":mm.tz(date,"Asia/Manila").format("MMM Do"),
                        "total": ToHms(total)
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

        }

    })
}

export default {Get}